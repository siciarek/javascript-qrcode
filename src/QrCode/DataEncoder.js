var DataEncoder = function () {
    'use strict';

    this.config = new Config();
    this.ec = new ErrorCorrection();
};

DataEncoder.prototype.constructor = DataEncoder;

DataEncoder.prototype.encodeNumeric = function (data) {
    'use strict';

    var wordSize = 10;
    var characters = data.split('');
    var word = null;
    var output = [];

    for (var i = 0; i < characters.length; i += 3) {
        var slice = characters.slice(i, i + 3).join('');

        wordSize = slice.length * 3 + 1;
        word = parseInt(slice);

        var binary = word.toString(2);

        while (binary.length < wordSize) {
            binary = '0' + binary;
        }

        output.push(binary);
    }

    return output;
};

DataEncoder.prototype.encodeAlphanumeric = function (data) {
    'use strict';

    var wordSize = 11;
    var characters = data.split('');
    var word = null;
    var output = [];

    var numbers = characters.map(function (e) {
        return this.alphanumericCharsTable[e];
    }, this);

    for (var i = 0; i < numbers.length; i += 2) {
        if (i + 1 < numbers.length) {
            word = 45 * numbers[i] + numbers[i + 1];
        }
        else {
            word = numbers[i];
            wordSize = Math.ceil(wordSize / 2);
        }

        var binary = word.toString(2);
        while (binary.length < wordSize) {
            binary = '0' + binary;
        }
        output.push(binary);
    }

    return output;
};

DataEncoder.prototype.encodeBinary = function (data) {
    'use strict';

    var wordSize = 8;
    var characters = data.bytes();
    var word = null;
    var binary;
    var output = [];

    for (var i = 0; i < characters.length; i += 1) {
        binary = characters[i].toString(2);
        while (binary.length < wordSize) {
            binary = '0' + binary;
        }
        output.push(binary);
    }

    return output;
};

DataEncoder.prototype.encodeData = function (data, mode, version, ecLevel) {
    'use strict';

    var padBytes = ['11101100', '00010001'];

    // Set mode indicator and character count indicator:

    var bitdata = [];

    // Encode data for given mode:

    if (mode === 'numeric') {
        bitdata = bitdata.concat(this.encodeNumeric(data));
    }
    else if (mode === 'alphanumeric') {
        bitdata = bitdata.concat(this.encodeAlphanumeric(data));
    }
    else if (mode === 'binary') {
        bitdata = bitdata.concat(this.encodeBinary(data));
    }
    else {
        throw 'Mode ' + mode + ' is not supported.';
    }

    var modeIndicator = this.config.dataModeBitStrings[mode];
    var characterCountIndicator = this.config.getCharacterCountIndicator(data.bytes().length, mode, version);

    bitdata.unshift(characterCountIndicator);
    bitdata.unshift(modeIndicator);

    var bitstring = bitdata.join('');

    // Add terminator:
    // ------------------------------------------------------------------------------

    bitstring += this.terminator(bitstring.length, version, ecLevel);

    // ------------------------------------------------------------------------------

    var codewords = [];

    var i = 0;
    while (true) {
        var octet = bitstring.substring(i, i + 8);
        if (octet === '') {
            break;
        }

        codewords.push(octet);
        i += 8;
    }

    // Add More 0s to Make the Length a Multiple of 8
    while (codewords[codewords.length - 1].length < 8) {
        codewords[codewords.length - 1] += '0';
    }

    // Add Pad Bytes if the String is Still too Short
    var blockInfo = this.config.getBlockInfo(version, ecLevel);
    var numberOfDataCodewords = blockInfo[0];
    var b = 0;
    while (codewords.length < numberOfDataCodewords) {
        codewords.push(padBytes[b % padBytes.length]);
        b += 1;
    }

    return codewords.parseInt(2);
};

DataEncoder.prototype.encode = function (data, mode, version, ecLevel) {
    'use strict';

    var encdata = this.encodeData(data, mode, version, ecLevel);
    var bytes = [];
    var octet;

    var databytes = encdata.map(function (e) {
        var val = e.toString(2);
        while (val.length < 8) {
            val = '0' + val;
        }
        return val;
    });

    var groups = {
        '1': [],
        '2': []
    };

    var block = [];
    var blocks = [];

    var ecc;
    var eccblocks = [];

    var nobg = {};
    var ndcg = {};

    var blockInfo = this.config.getBlockInfo(version, ecLevel);
    nobg['1'] = blockInfo[2]; // Number of Blocks in Group 1
    ndcg['1'] = blockInfo[3]; // Number of Data Codewords in Each of Group 1's Blocks
    nobg['2'] = blockInfo[4]; // Number of Blocks in Group 2
    ndcg['2'] = blockInfo[5]; // Number of Data Codewords in Each of Group 2's Blocks

    var ndcmax = Math.max(ndcg['1'], ndcg['2']);

    var g, b, c, n, index;

    for (index in nobg) {
        if (nobg.hasOwnProperty(index)) {
            for (g = 0; g < nobg[index]; g += 1) {
                block = [];

                for (c = 0; c < ndcg[index]; c += 1) {
                    block.push(parseInt(databytes.shift(), 2));
                }

                ecc = this.ec.getCode(block, version, ecLevel);
                eccblocks.push(ecc);

                while (block.length < ndcmax) {
                    block.push(null);
                }

                groups[index][g] = block;
                blocks.push(block);
            }
        }
    }

    var finalData = [];
    var finalEcCodewords = [];

    // Interleave the Data Codewords
    for (n = 0; n < ndcmax; n += 1) {
        for (b = 0; b < blocks.length; b += 1) {
            if (blocks[b][n] !== null) {
                finalData.push(blocks[b][n]);
            }
        }
    }

    // Interleave the Error Correction Codewords
    for (n = 0; n < eccblocks[0].length; n += 1) {
        for (b = 0; b < eccblocks.length; b += 1) {
            finalEcCodewords.push(eccblocks[b][n]);
        }
    }

    finalData = finalData.concat(finalEcCodewords);

    while (finalData.length > 0) {
        octet = finalData.shift().toString(2);

        while (octet.length < 8) {
            octet = '0' + octet;
        }

        bytes.push(octet);
    }

    var datastr = bytes.join('');

    // Add remainder:
    // ------------------------------------------------------------------------------

    datastr += this.remainder(version);

    // ------------------------------------------------------------------------------

    return datastr;
};

DataEncoder.prototype.terminator = function (len, version, ecLevel) {
    'use strict';

    var terminator = '0000';
    var blockInfo = this.config.getBlockInfo(version, ecLevel);
    var numberOfDataCodewords = blockInfo[0];
    var numberOfDataBits = numberOfDataCodewords * 8;
    var diff = numberOfDataBits - len;

    if (diff < 4) {
        terminator = '';
        for (var d = 0; d < diff; d += 1) {
            terminator += '0';
        }
    }

    return terminator;
};

DataEncoder.prototype.remainder = function (version) {
    'use strict';

    var rb = this.config.remainderBits[version];
    var remainder = '';

    while (rb > 0) {
        remainder += '0';
        rb -= 1;
    }

    return remainder;
};

DataEncoder.prototype.alphanumericCharsTable = {
    '0': 0,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    'A': 10,
    'B': 11,
    'C': 12,
    'D': 13,
    'E': 14,
    'F': 15,
    'G': 16,
    'H': 17,
    'I': 18,
    'J': 19,
    'K': 20,
    'L': 21,
    'M': 22,
    'N': 23,
    'O': 24,
    'P': 25,
    'Q': 26,
    'R': 27,
    'S': 28,
    'T': 29,
    'U': 30,
    'V': 31,
    'W': 32,
    'X': 33,
    'Y': 34,
    'Z': 35,
    ' ': 36,
    '$': 37,
    '%': 38,
    '*': 39,
    '+': 40,
    '-': 41,
    '.': 42,
    '/': 43,
    ':': 44
};

