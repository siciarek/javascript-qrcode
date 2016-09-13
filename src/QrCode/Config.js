var Config = function() {

};

Object.defineProperties(Config.prototype, {
    'constructor': {
        value: Config,
        enumerable: false,
    },
    'xorBits': {
        value: function(first, second) {
            'use strict';

            /* jshint bitwise: false */

            return (parseInt(first, 2) ^ parseInt(second, 2)).toString(2);
        },
        enumerable: false,
    },
    'getVersionInformationString': {
        value: function(version) {

            'use strict';

            var generatorPolynominal = '1111100100101';

            var versionString = parseInt(version).toString(2);

            while (versionString.length < 6) {
                versionString = '0' + versionString;
            }

            var result = versionString;

            // Turn this into an 18 bit string by padding on the right with 0s:
            while (result.length < 18) {
                result += '0';
            }

            // And remove the 0s from the left side:
            result = result.replace(/^0+/, '');

            while (result.length >= 13) {
                var gp = generatorPolynominal;

                // 1. Pad the generator polynomial string on the RIGHT with 0s to make it the same length as the current format string.
                while (gp.length < result.length) {
                    gp += '0';
                }

                // 2. XOR the padded generator polynomial string with the current format string.
                result = this.xorBits(gp, result);

                // 3. Remove 0s from the left side of the result.
                result = result.replace(/^0+/, '');
            }

            // If the result were smaller than 10 bits, we would pad it on the LEFT with 0s to make it 10 bits long.
            while (result.length < 12) {
                result = '0' + result;
            }

            return versionString + result;
        },
        enumerable: false,
    },
    getFormatString: {
        value: function(correctionLevel, maskPattern) {
            'use strict';

            correctionLevel = correctionLevel || 'M';
            maskPattern = maskPattern || 0;

            var generatorPolynominal = '10100110111';
            var mask = '101010000010010';

            var formatString = '';
            var result;

            var cl = this.correctionLevels[correctionLevel].toString(2);
            while (cl.length < 2) {
                cl = '0' + cl;
            }
            formatString += cl;

            var mp = parseInt(maskPattern).toString(2);
            while (mp.length < 3) {
                mp = '0' + mp;
            }
            formatString += mp;

            result = formatString;

            // To do this, first create a 15-bit string by putting ten 0s to the RIGHT of the format string, like so:
            while (result.length < 15) {
                result += '0';
            }

            // Now remove any 0s from the LEFT side:
            result = result.replace(/^0+/, '');

            while (result.length >= 11) {
                var gp = generatorPolynominal;

                // 1. Pad the generator polynomial string on the RIGHT with 0s to make it the same length as the current format string.
                while (gp.length < result.length) {
                    gp += '0';
                }

                // 2. XOR the padded generator polynomial string with the current format string.
                result = this.xorBits(gp, result);

                // 3. Remove 0s from the left side of the result.
                result = result.replace(/^0+/, '');
            }

            // If the result were smaller than 10 bits, we would pad it on the LEFT with 0s to make it 10 bits long.
            while (result.length < 10) {
                result = '0' + result;
            }

            // Put the Format and Error Correction Bits Together
            formatString += result;

            // XOR with the Mask String:
            formatString = this.xorBits(formatString, mask);

            while (formatString.length < 15) {
                formatString = '0' + formatString;
            }

            return formatString;
        },
        enumerable: false,
    },
    'getBlockInfo': {
        value: function(version, correctionLevel) {
            'use strict';

            var key = version + '-' + correctionLevel;

            if (!(version !== null && correctionLevel !== null)) {
                throw new InvalidVersionNumberException();
            }

            return this.dataSizeInfo[key];
        },
        enumerable: false,
    },
    'getCharacterCountIndicator': {
        value: function(characterCount, mode, version) {
            'use strict';

            var characterCountIndicator = characterCount.toString(2);
            var wordSizes = this.wordSizes[mode];
            var wordSize = 0;

            for (var key in wordSizes) {
                if (wordSizes.hasOwnProperty(key)) {
                    var range = key.split('-').parseInt();
                    if (version >= range[0] && version <= range[1]) {
                        wordSize = wordSizes[key];
                        break;
                    }
                }
            }
            while (characterCountIndicator.length < wordSize) {
                characterCountIndicator = '0' + characterCountIndicator;
            }

            return characterCountIndicator;
        },
        enumerable: false,
    },
    'getCapacityRange': {
        value: function(mode, eclevel) {
            'use strict';

            var maxversion = Object.keys(this.characterCapacities).pop();

            return {
                min: 1,
                max: this.characterCapacities[maxversion][eclevel][mode]
            };
        },
        enumerable: false,
    },
    'correctionLevels': {
        value: {
            L: 1,
            M: 0,
            Q: 3,
            H: 2
        },
        enumerable: false,
    },
    'remainderBits': {
        value: {
            1: 0,
            2: 7,
            3: 7,
            4: 7,
            5: 7,
            6: 7,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 3,
            15: 3,
            16: 3,
            17: 3,
            18: 3,
            19: 3,
            20: 3,
            21: 4,
            22: 4,
            23: 4,
            24: 4,
            25: 4,
            26: 4,
            27: 4,
            28: 3,
            29: 3,
            30: 3,
            31: 3,
            32: 3,
            33: 3,
            34: 3,
            35: 0,
            36: 0,
            37: 0,
            38: 0,
            39: 0,
            40: 0
        },
        enumerable: false,
    },
    'dataSizeInfo': {
        value: {
            "1-L": [19, 7, 1, 19, 0, 0],
            "1-M": [16, 10, 1, 16, 0, 0],
            "1-Q": [13, 13, 1, 13, 0, 0],
            "1-H": [9, 17, 1, 9, 0, 0],
            "2-L": [34, 10, 1, 34, 0, 0],
            "2-M": [28, 16, 1, 28, 0, 0],
            "2-Q": [22, 22, 1, 22, 0, 0],
            "2-H": [16, 28, 1, 16, 0, 0],
            "3-L": [55, 15, 1, 55, 0, 0],
            "3-M": [44, 26, 1, 44, 0, 0],
            "3-Q": [34, 18, 2, 17, 0, 0],
            "3-H": [26, 22, 2, 13, 0, 0],
            "4-L": [80, 20, 1, 80, 0, 0],
            "4-M": [64, 18, 2, 32, 0, 0],
            "4-Q": [48, 26, 2, 24, 0, 0],
            "4-H": [36, 16, 4, 9, 0, 0],
            "5-L": [108, 26, 1, 108, 0, 0],
            "5-M": [86, 24, 2, 43, 0, 0],
            "5-Q": [62, 18, 2, 15, 2, 16],
            "5-H": [46, 22, 2, 11, 2, 12],
            "6-L": [136, 18, 2, 68, 0, 0],
            "6-M": [108, 16, 4, 27, 0, 0],
            "6-Q": [76, 24, 4, 19, 0, 0],
            "6-H": [60, 28, 4, 15, 0, 0],
            "7-L": [156, 20, 2, 78, 0, 0],
            "7-M": [124, 18, 4, 31, 0, 0],
            "7-Q": [88, 18, 2, 14, 4, 15],
            "7-H": [66, 26, 4, 13, 1, 14],
            "8-L": [194, 24, 2, 97, 0, 0],
            "8-M": [154, 22, 2, 38, 2, 39],
            "8-Q": [110, 22, 4, 18, 2, 19],
            "8-H": [86, 26, 4, 14, 2, 15],
            "9-L": [232, 30, 2, 116, 0, 0],
            "9-M": [182, 22, 3, 36, 2, 37],
            "9-Q": [132, 20, 4, 16, 4, 17],
            "9-H": [100, 24, 4, 12, 4, 13],
            "10-L": [274, 18, 2, 68, 2, 69],
            "10-M": [216, 26, 4, 43, 1, 44],
            "10-Q": [154, 24, 6, 19, 2, 20],
            "10-H": [122, 28, 6, 15, 2, 16],
            "11-L": [324, 20, 4, 81, 0, 0],
            "11-M": [254, 30, 1, 50, 4, 51],
            "11-Q": [180, 28, 4, 22, 4, 23],
            "11-H": [140, 24, 3, 12, 8, 13],
            "12-L": [370, 24, 2, 92, 2, 93],
            "12-M": [290, 22, 6, 36, 2, 37],
            "12-Q": [206, 26, 4, 20, 6, 21],
            "12-H": [158, 28, 7, 14, 4, 15],
            "13-L": [428, 26, 4, 107, 0, 0],
            "13-M": [334, 22, 8, 37, 1, 38],
            "13-Q": [244, 24, 8, 20, 4, 21],
            "13-H": [180, 22, 12, 11, 4, 12],
            "14-L": [461, 30, 3, 115, 1, 116],
            "14-M": [365, 24, 4, 40, 5, 41],
            "14-Q": [261, 20, 11, 16, 5, 17],
            "14-H": [197, 24, 11, 12, 5, 13],
            "15-L": [523, 22, 5, 87, 1, 88],
            "15-M": [415, 24, 5, 41, 5, 42],
            "15-Q": [295, 30, 5, 24, 7, 25],
            "15-H": [223, 24, 11, 12, 7, 13],
            "16-L": [589, 24, 5, 98, 1, 99],
            "16-M": [453, 28, 7, 45, 3, 46],
            "16-Q": [325, 24, 15, 19, 2, 20],
            "16-H": [253, 30, 3, 15, 13, 16],
            "17-L": [647, 28, 1, 107, 5, 108],
            "17-M": [507, 28, 10, 46, 1, 47],
            "17-Q": [367, 28, 1, 22, 15, 23],
            "17-H": [283, 28, 2, 14, 17, 15],
            "18-L": [721, 30, 5, 120, 1, 121],
            "18-M": [563, 26, 9, 43, 4, 44],
            "18-Q": [397, 28, 17, 22, 1, 23],
            "18-H": [313, 28, 2, 14, 19, 15],
            "19-L": [795, 28, 3, 113, 4, 114],
            "19-M": [627, 26, 3, 44, 11, 45],
            "19-Q": [445, 26, 17, 21, 4, 22],
            "19-H": [341, 26, 9, 13, 16, 14],
            "20-L": [861, 28, 3, 107, 5, 108],
            "20-M": [669, 26, 3, 41, 13, 42],
            "20-Q": [485, 30, 15, 24, 5, 25],
            "20-H": [385, 28, 15, 15, 10, 16],
            "21-L": [932, 28, 4, 116, 4, 117],
            "21-M": [714, 26, 17, 42, 0, 0],
            "21-Q": [512, 28, 17, 22, 6, 23],
            "21-H": [406, 30, 19, 16, 6, 17],
            "22-L": [1006, 28, 2, 111, 7, 112],
            "22-M": [782, 28, 17, 46, 0, 0],
            "22-Q": [568, 30, 7, 24, 16, 25],
            "22-H": [442, 24, 34, 13, 0, 0],
            "23-L": [1094, 30, 4, 121, 5, 122],
            "23-M": [860, 28, 4, 47, 14, 48],
            "23-Q": [614, 30, 11, 24, 14, 25],
            "23-H": [464, 30, 16, 15, 14, 16],
            "24-L": [1174, 30, 6, 117, 4, 118],
            "24-M": [914, 28, 6, 45, 14, 46],
            "24-Q": [664, 30, 11, 24, 16, 25],
            "24-H": [514, 30, 30, 16, 2, 17],
            "25-L": [1276, 26, 8, 106, 4, 107],
            "25-M": [1000, 28, 8, 47, 13, 48],
            "25-Q": [718, 30, 7, 24, 22, 25],
            "25-H": [538, 30, 22, 15, 13, 16],
            "26-L": [1370, 28, 10, 114, 2, 115],
            "26-M": [1062, 28, 19, 46, 4, 47],
            "26-Q": [754, 28, 28, 22, 6, 23],
            "26-H": [596, 30, 33, 16, 4, 17],
            "27-L": [1468, 30, 8, 122, 4, 123],
            "27-M": [1128, 28, 22, 45, 3, 46],
            "27-Q": [808, 30, 8, 23, 26, 24],
            "27-H": [628, 30, 12, 15, 28, 16],
            "28-L": [1531, 30, 3, 117, 10, 118],
            "28-M": [1193, 28, 3, 45, 23, 46],
            "28-Q": [871, 30, 4, 24, 31, 25],
            "28-H": [661, 30, 11, 15, 31, 16],
            "29-L": [1631, 30, 7, 116, 7, 117],
            "29-M": [1267, 28, 21, 45, 7, 46],
            "29-Q": [911, 30, 1, 23, 37, 24],
            "29-H": [701, 30, 19, 15, 26, 16],
            "30-L": [1735, 30, 5, 115, 10, 116],
            "30-M": [1373, 28, 19, 47, 10, 48],
            "30-Q": [985, 30, 15, 24, 25, 25],
            "30-H": [745, 30, 23, 15, 25, 16],
            "31-L": [1843, 30, 13, 115, 3, 116],
            "31-M": [1455, 28, 2, 46, 29, 47],
            "31-Q": [1033, 30, 42, 24, 1, 25],
            "31-H": [793, 30, 23, 15, 28, 16],
            "32-L": [1955, 30, 17, 115, 0, 0],
            "32-M": [1541, 28, 10, 46, 23, 47],
            "32-Q": [1115, 30, 10, 24, 35, 25],
            "32-H": [845, 30, 19, 15, 35, 16],
            "33-L": [2071, 30, 17, 115, 1, 116],
            "33-M": [1631, 28, 14, 46, 21, 47],
            "33-Q": [1171, 30, 29, 24, 19, 25],
            "33-H": [901, 30, 11, 15, 46, 16],
            "34-L": [2191, 30, 13, 115, 6, 116],
            "34-M": [1725, 28, 14, 46, 23, 47],
            "34-Q": [1231, 30, 44, 24, 7, 25],
            "34-H": [961, 30, 59, 16, 1, 17],
            "35-L": [2306, 30, 12, 121, 7, 122],
            "35-M": [1812, 28, 12, 47, 26, 48],
            "35-Q": [1286, 30, 39, 24, 14, 25],
            "35-H": [986, 30, 22, 15, 41, 16],
            "36-L": [2434, 30, 6, 121, 14, 122],
            "36-M": [1914, 28, 6, 47, 34, 48],
            "36-Q": [1354, 30, 46, 24, 10, 25],
            "36-H": [1054, 30, 2, 15, 64, 16],
            "37-L": [2566, 30, 17, 122, 4, 123],
            "37-M": [1992, 28, 29, 46, 14, 47],
            "37-Q": [1426, 30, 49, 24, 10, 25],
            "37-H": [1096, 30, 24, 15, 46, 16],
            "38-L": [2702, 30, 4, 122, 18, 123],
            "38-M": [2102, 28, 13, 46, 32, 47],
            "38-Q": [1502, 30, 48, 24, 14, 25],
            "38-H": [1142, 30, 42, 15, 32, 16],
            "39-L": [2812, 30, 20, 117, 4, 118],
            "39-M": [2216, 28, 40, 47, 7, 48],
            "39-Q": [1582, 30, 43, 24, 22, 25],
            "39-H": [1222, 30, 10, 15, 67, 16],
            "40-L": [2956, 30, 19, 118, 6, 119],
            "40-M": [2334, 28, 18, 47, 31, 48],
            "40-Q": [1666, 30, 34, 24, 34, 25],
            "40-H": [1276, 30, 20, 15, 61, 16]
        },
        enumerable: false,
    },
    'dataModeBitStrings': {
        value: {
            numeric: '0001',
            alphanumeric: '0010',
            binary: '0100',
            kanji: '1000'
        },
        enumerable: false,
    },
    'wordSizes': {
        value: {
            numeric: {
                '1-9': 10,
                '10-26': 12,
                '27-40': 14
            },
            alphanumeric: {
                '1-9': 9,
                '10-26': 11,
                '27-40': 13
            },
            binary: {
                '1-9': 8,
                '10-26': 16,
                '27-40': 16
            },
            kanji: {
                '1-9': 8,
                '10-26': 10,
                '27-40': 12
            }
        },
        enumerable: false,
    },
    'alignmentPatternLocations': {
        value: {
            1: [],
            2: [6, 18],
            3: [6, 22],
            4: [6, 26],
            5: [6, 30],
            6: [6, 34],
            7: [6, 22, 38],
            8: [6, 24, 42],
            9: [6, 26, 46],
            10: [6, 28, 50],
            11: [6, 30, 54],
            12: [6, 32, 58],
            13: [6, 34, 62],
            14: [6, 26, 46, 66],
            15: [6, 26, 48, 70],
            16: [6, 26, 50, 74],
            17: [6, 30, 54, 78],
            18: [6, 30, 56, 82],
            19: [6, 30, 58, 86],
            20: [6, 34, 62, 90],
            21: [6, 28, 50, 72, 94],
            22: [6, 26, 50, 74, 98],
            23: [6, 30, 54, 78, 102],
            24: [6, 28, 54, 80, 106],
            25: [6, 32, 58, 84, 110],
            26: [6, 30, 58, 86, 114],
            27: [6, 34, 62, 90, 118],
            28: [6, 26, 50, 74, 98, 122],
            29: [6, 30, 54, 78, 102, 126],
            30: [6, 26, 52, 78, 104, 130],
            31: [6, 30, 56, 82, 108, 134],
            32: [6, 34, 60, 86, 112, 138],
            33: [6, 30, 58, 86, 114, 142],
            34: [6, 34, 62, 90, 118, 146],
            35: [6, 30, 54, 78, 102, 126, 150],
            36: [6, 24, 50, 76, 102, 128, 154],
            37: [6, 28, 54, 80, 106, 132, 158],
            38: [6, 32, 58, 84, 110, 136, 162],
            39: [6, 26, 54, 82, 110, 138, 166],
            40: [6, 30, 58, 86, 114, 142, 170]
        },
        enumerable: false,
    },
    'characterCapacities': {
        value: {
            "1": {
                "L": {
                    "numeric": 41,
                    "alphanumeric": 25,
                    "binary": 17,
                    "kanji": 10
                },
                "M": {
                    "numeric": 34,
                    "alphanumeric": 20,
                    "binary": 14,
                    "kanji": 8
                },
                "Q": {
                    "numeric": 27,
                    "alphanumeric": 16,
                    "binary": 11,
                    "kanji": 7
                },
                "H": {
                    "numeric": 17,
                    "alphanumeric": 10,
                    "binary": 7,
                    "kanji": 4
                }
            },
            "2": {
                "L": {
                    "numeric": 77,
                    "alphanumeric": 47,
                    "binary": 32,
                    "kanji": 20
                },
                "M": {
                    "numeric": 63,
                    "alphanumeric": 38,
                    "binary": 26,
                    "kanji": 16
                },
                "Q": {
                    "numeric": 48,
                    "alphanumeric": 29,
                    "binary": 20,
                    "kanji": 12
                },
                "H": {
                    "numeric": 34,
                    "alphanumeric": 20,
                    "binary": 14,
                    "kanji": 8
                }
            },
            "3": {
                "L": {
                    "numeric": 127,
                    "alphanumeric": 77,
                    "binary": 53,
                    "kanji": 32
                },
                "M": {
                    "numeric": 101,
                    "alphanumeric": 61,
                    "binary": 42,
                    "kanji": 26
                },
                "Q": {
                    "numeric": 77,
                    "alphanumeric": 47,
                    "binary": 32,
                    "kanji": 20
                },
                "H": {
                    "numeric": 58,
                    "alphanumeric": 35,
                    "binary": 24,
                    "kanji": 15
                }
            },
            "4": {
                "L": {
                    "numeric": 187,
                    "alphanumeric": 114,
                    "binary": 78,
                    "kanji": 48
                },
                "M": {
                    "numeric": 149,
                    "alphanumeric": 90,
                    "binary": 62,
                    "kanji": 38
                },
                "Q": {
                    "numeric": 111,
                    "alphanumeric": 67,
                    "binary": 46,
                    "kanji": 28
                },
                "H": {
                    "numeric": 82,
                    "alphanumeric": 50,
                    "binary": 34,
                    "kanji": 21
                }
            },
            "5": {
                "L": {
                    "numeric": 255,
                    "alphanumeric": 154,
                    "binary": 106,
                    "kanji": 65
                },
                "M": {
                    "numeric": 202,
                    "alphanumeric": 122,
                    "binary": 84,
                    "kanji": 52
                },
                "Q": {
                    "numeric": 144,
                    "alphanumeric": 87,
                    "binary": 60,
                    "kanji": 37
                },
                "H": {
                    "numeric": 106,
                    "alphanumeric": 64,
                    "binary": 44,
                    "kanji": 27
                }
            },
            "6": {
                "L": {
                    "numeric": 322,
                    "alphanumeric": 195,
                    "binary": 134,
                    "kanji": 82
                },
                "M": {
                    "numeric": 255,
                    "alphanumeric": 154,
                    "binary": 106,
                    "kanji": 65
                },
                "Q": {
                    "numeric": 178,
                    "alphanumeric": 108,
                    "binary": 74,
                    "kanji": 45
                },
                "H": {
                    "numeric": 139,
                    "alphanumeric": 84,
                    "binary": 58,
                    "kanji": 36
                }
            },
            "7": {
                "L": {
                    "numeric": 370,
                    "alphanumeric": 224,
                    "binary": 154,
                    "kanji": 95
                },
                "M": {
                    "numeric": 293,
                    "alphanumeric": 178,
                    "binary": 122,
                    "kanji": 75
                },
                "Q": {
                    "numeric": 207,
                    "alphanumeric": 125,
                    "binary": 86,
                    "kanji": 53
                },
                "H": {
                    "numeric": 154,
                    "alphanumeric": 93,
                    "binary": 64,
                    "kanji": 39
                }
            },
            "8": {
                "L": {
                    "numeric": 461,
                    "alphanumeric": 279,
                    "binary": 192,
                    "kanji": 118
                },
                "M": {
                    "numeric": 365,
                    "alphanumeric": 221,
                    "binary": 152,
                    "kanji": 93
                },
                "Q": {
                    "numeric": 259,
                    "alphanumeric": 157,
                    "binary": 108,
                    "kanji": 66
                },
                "H": {
                    "numeric": 202,
                    "alphanumeric": 122,
                    "binary": 84,
                    "kanji": 52
                }
            },
            "9": {
                "L": {
                    "numeric": 552,
                    "alphanumeric": 335,
                    "binary": 230,
                    "kanji": 141
                },
                "M": {
                    "numeric": 432,
                    "alphanumeric": 262,
                    "binary": 180,
                    "kanji": 111
                },
                "Q": {
                    "numeric": 312,
                    "alphanumeric": 189,
                    "binary": 130,
                    "kanji": 80
                },
                "H": {
                    "numeric": 235,
                    "alphanumeric": 143,
                    "binary": 98,
                    "kanji": 60
                }
            },
            "10": {
                "L": {
                    "numeric": 652,
                    "alphanumeric": 395,
                    "binary": 271,
                    "kanji": 167
                },
                "M": {
                    "numeric": 513,
                    "alphanumeric": 311,
                    "binary": 213,
                    "kanji": 131
                },
                "Q": {
                    "numeric": 364,
                    "alphanumeric": 221,
                    "binary": 151,
                    "kanji": 93
                },
                "H": {
                    "numeric": 288,
                    "alphanumeric": 174,
                    "binary": 119,
                    "kanji": 74
                }
            },
            "11": {
                "L": {
                    "numeric": 772,
                    "alphanumeric": 468,
                    "binary": 321,
                    "kanji": 198
                },
                "M": {
                    "numeric": 604,
                    "alphanumeric": 366,
                    "binary": 251,
                    "kanji": 155
                },
                "Q": {
                    "numeric": 427,
                    "alphanumeric": 259,
                    "binary": 177,
                    "kanji": 109
                },
                "H": {
                    "numeric": 331,
                    "alphanumeric": 200,
                    "binary": 137,
                    "kanji": 85
                }
            },
            "12": {
                "L": {
                    "numeric": 883,
                    "alphanumeric": 535,
                    "binary": 367,
                    "kanji": 226
                },
                "M": {
                    "numeric": 691,
                    "alphanumeric": 419,
                    "binary": 287,
                    "kanji": 177
                },
                "Q": {
                    "numeric": 489,
                    "alphanumeric": 296,
                    "binary": 203,
                    "kanji": 125
                },
                "H": {
                    "numeric": 374,
                    "alphanumeric": 227,
                    "binary": 155,
                    "kanji": 96
                }
            },
            "13": {
                "L": {
                    "numeric": 1022,
                    "alphanumeric": 619,
                    "binary": 425,
                    "kanji": 262
                },
                "M": {
                    "numeric": 796,
                    "alphanumeric": 483,
                    "binary": 331,
                    "kanji": 204
                },
                "Q": {
                    "numeric": 580,
                    "alphanumeric": 352,
                    "binary": 241,
                    "kanji": 149
                },
                "H": {
                    "numeric": 427,
                    "alphanumeric": 259,
                    "binary": 177,
                    "kanji": 109
                }
            },
            "14": {
                "L": {
                    "numeric": 1101,
                    "alphanumeric": 667,
                    "binary": 458,
                    "kanji": 282
                },
                "M": {
                    "numeric": 871,
                    "alphanumeric": 528,
                    "binary": 362,
                    "kanji": 223
                },
                "Q": {
                    "numeric": 621,
                    "alphanumeric": 376,
                    "binary": 258,
                    "kanji": 159
                },
                "H": {
                    "numeric": 468,
                    "alphanumeric": 283,
                    "binary": 194,
                    "kanji": 120
                }
            },
            "15": {
                "L": {
                    "numeric": 1250,
                    "alphanumeric": 758,
                    "binary": 520,
                    "kanji": 320
                },
                "M": {
                    "numeric": 991,
                    "alphanumeric": 600,
                    "binary": 412,
                    "kanji": 254
                },
                "Q": {
                    "numeric": 703,
                    "alphanumeric": 426,
                    "binary": 292,
                    "kanji": 180
                },
                "H": {
                    "numeric": 530,
                    "alphanumeric": 321,
                    "binary": 220,
                    "kanji": 136
                }
            },
            "16": {
                "L": {
                    "numeric": 1408,
                    "alphanumeric": 854,
                    "binary": 586,
                    "kanji": 361
                },
                "M": {
                    "numeric": 1082,
                    "alphanumeric": 656,
                    "binary": 450,
                    "kanji": 277
                },
                "Q": {
                    "numeric": 775,
                    "alphanumeric": 470,
                    "binary": 322,
                    "kanji": 198
                },
                "H": {
                    "numeric": 602,
                    "alphanumeric": 365,
                    "binary": 250,
                    "kanji": 154
                }
            },
            "17": {
                "L": {
                    "numeric": 1548,
                    "alphanumeric": 938,
                    "binary": 644,
                    "kanji": 397
                },
                "M": {
                    "numeric": 1212,
                    "alphanumeric": 734,
                    "binary": 504,
                    "kanji": 310
                },
                "Q": {
                    "numeric": 876,
                    "alphanumeric": 531,
                    "binary": 364,
                    "kanji": 224
                },
                "H": {
                    "numeric": 674,
                    "alphanumeric": 408,
                    "binary": 280,
                    "kanji": 173
                }
            },
            "18": {
                "L": {
                    "numeric": 1725,
                    "alphanumeric": 1046,
                    "binary": 718,
                    "kanji": 442
                },
                "M": {
                    "numeric": 1346,
                    "alphanumeric": 816,
                    "binary": 560,
                    "kanji": 345
                },
                "Q": {
                    "numeric": 948,
                    "alphanumeric": 574,
                    "binary": 394,
                    "kanji": 243
                },
                "H": {
                    "numeric": 746,
                    "alphanumeric": 452,
                    "binary": 310,
                    "kanji": 191
                }
            },
            "19": {
                "L": {
                    "numeric": 1903,
                    "alphanumeric": 1153,
                    "binary": 792,
                    "kanji": 488
                },
                "M": {
                    "numeric": 1500,
                    "alphanumeric": 909,
                    "binary": 624,
                    "kanji": 384
                },
                "Q": {
                    "numeric": 1063,
                    "alphanumeric": 644,
                    "binary": 442,
                    "kanji": 272
                },
                "H": {
                    "numeric": 813,
                    "alphanumeric": 493,
                    "binary": 338,
                    "kanji": 208
                }
            },
            "20": {
                "L": {
                    "numeric": 2061,
                    "alphanumeric": 1249,
                    "binary": 858,
                    "kanji": 528
                },
                "M": {
                    "numeric": 1600,
                    "alphanumeric": 970,
                    "binary": 666,
                    "kanji": 410
                },
                "Q": {
                    "numeric": 1159,
                    "alphanumeric": 702,
                    "binary": 482,
                    "kanji": 297
                },
                "H": {
                    "numeric": 919,
                    "alphanumeric": 557,
                    "binary": 382,
                    "kanji": 235
                }
            },
            "21": {
                "L": {
                    "numeric": 2232,
                    "alphanumeric": 1352,
                    "binary": 929,
                    "kanji": 572
                },
                "M": {
                    "numeric": 1708,
                    "alphanumeric": 1035,
                    "binary": 711,
                    "kanji": 438
                },
                "Q": {
                    "numeric": 1224,
                    "alphanumeric": 742,
                    "binary": 509,
                    "kanji": 314
                },
                "H": {
                    "numeric": 969,
                    "alphanumeric": 587,
                    "binary": 403,
                    "kanji": 248
                }
            },
            "22": {
                "L": {
                    "numeric": 2409,
                    "alphanumeric": 1460,
                    "binary": 1003,
                    "kanji": 618
                },
                "M": {
                    "numeric": 1872,
                    "alphanumeric": 1134,
                    "binary": 779,
                    "kanji": 480
                },
                "Q": {
                    "numeric": 1358,
                    "alphanumeric": 823,
                    "binary": 565,
                    "kanji": 348
                },
                "H": {
                    "numeric": 1056,
                    "alphanumeric": 640,
                    "binary": 439,
                    "kanji": 270
                }
            },
            "23": {
                "L": {
                    "numeric": 2620,
                    "alphanumeric": 1588,
                    "binary": 1091,
                    "kanji": 672
                },
                "M": {
                    "numeric": 2059,
                    "alphanumeric": 1248,
                    "binary": 857,
                    "kanji": 528
                },
                "Q": {
                    "numeric": 1468,
                    "alphanumeric": 890,
                    "binary": 611,
                    "kanji": 376
                },
                "H": {
                    "numeric": 1108,
                    "alphanumeric": 672,
                    "binary": 461,
                    "kanji": 284
                }
            },
            "24": {
                "L": {
                    "numeric": 2812,
                    "alphanumeric": 1704,
                    "binary": 1171,
                    "kanji": 721
                },
                "M": {
                    "numeric": 2188,
                    "alphanumeric": 1326,
                    "binary": 911,
                    "kanji": 561
                },
                "Q": {
                    "numeric": 1588,
                    "alphanumeric": 963,
                    "binary": 661,
                    "kanji": 407
                },
                "H": {
                    "numeric": 1228,
                    "alphanumeric": 744,
                    "binary": 511,
                    "kanji": 315
                }
            },
            "25": {
                "L": {
                    "numeric": 3057,
                    "alphanumeric": 1853,
                    "binary": 1273,
                    "kanji": 784
                },
                "M": {
                    "numeric": 2395,
                    "alphanumeric": 1451,
                    "binary": 997,
                    "kanji": 614
                },
                "Q": {
                    "numeric": 1718,
                    "alphanumeric": 1041,
                    "binary": 715,
                    "kanji": 440
                },
                "H": {
                    "numeric": 1286,
                    "alphanumeric": 779,
                    "binary": 535,
                    "kanji": 330
                }
            },
            "26": {
                "L": {
                    "numeric": 3283,
                    "alphanumeric": 1990,
                    "binary": 1367,
                    "kanji": 842
                },
                "M": {
                    "numeric": 2544,
                    "alphanumeric": 1542,
                    "binary": 1059,
                    "kanji": 652
                },
                "Q": {
                    "numeric": 1804,
                    "alphanumeric": 1094,
                    "binary": 751,
                    "kanji": 462
                },
                "H": {
                    "numeric": 1425,
                    "alphanumeric": 864,
                    "binary": 593,
                    "kanji": 365
                }
            },
            "27": {
                "L": {
                    "numeric": 3517,
                    "alphanumeric": 2132,
                    "binary": 1465,
                    "kanji": 902
                },
                "M": {
                    "numeric": 2701,
                    "alphanumeric": 1637,
                    "binary": 1125,
                    "kanji": 692
                },
                "Q": {
                    "numeric": 1933,
                    "alphanumeric": 1172,
                    "binary": 805,
                    "kanji": 496
                },
                "H": {
                    "numeric": 1501,
                    "alphanumeric": 910,
                    "binary": 625,
                    "kanji": 385
                }
            },
            "28": {
                "L": {
                    "numeric": 3669,
                    "alphanumeric": 2223,
                    "binary": 1528,
                    "kanji": 940
                },
                "M": {
                    "numeric": 2857,
                    "alphanumeric": 1732,
                    "binary": 1190,
                    "kanji": 732
                },
                "Q": {
                    "numeric": 2085,
                    "alphanumeric": 1263,
                    "binary": 868,
                    "kanji": 534
                },
                "H": {
                    "numeric": 1581,
                    "alphanumeric": 958,
                    "binary": 658,
                    "kanji": 405
                }
            },
            "29": {
                "L": {
                    "numeric": 3909,
                    "alphanumeric": 2369,
                    "binary": 1628,
                    "kanji": 1002
                },
                "M": {
                    "numeric": 3035,
                    "alphanumeric": 1839,
                    "binary": 1264,
                    "kanji": 778
                },
                "Q": {
                    "numeric": 2181,
                    "alphanumeric": 1322,
                    "binary": 908,
                    "kanji": 559
                },
                "H": {
                    "numeric": 1677,
                    "alphanumeric": 1016,
                    "binary": 698,
                    "kanji": 430
                }
            },
            "30": {
                "L": {
                    "numeric": 4158,
                    "alphanumeric": 2520,
                    "binary": 1732,
                    "kanji": 1066
                },
                "M": {
                    "numeric": 3289,
                    "alphanumeric": 1994,
                    "binary": 1370,
                    "kanji": 843
                },
                "Q": {
                    "numeric": 2358,
                    "alphanumeric": 1429,
                    "binary": 982,
                    "kanji": 604
                },
                "H": {
                    "numeric": 1782,
                    "alphanumeric": 1080,
                    "binary": 742,
                    "kanji": 457
                }
            },
            "31": {
                "L": {
                    "numeric": 4417,
                    "alphanumeric": 2677,
                    "binary": 1840,
                    "kanji": 1132
                },
                "M": {
                    "numeric": 3486,
                    "alphanumeric": 2113,
                    "binary": 1452,
                    "kanji": 894
                },
                "Q": {
                    "numeric": 2473,
                    "alphanumeric": 1499,
                    "binary": 1030,
                    "kanji": 634
                },
                "H": {
                    "numeric": 1897,
                    "alphanumeric": 1150,
                    "binary": 790,
                    "kanji": 486
                }
            },
            "32": {
                "L": {
                    "numeric": 4686,
                    "alphanumeric": 2840,
                    "binary": 1952,
                    "kanji": 1201
                },
                "M": {
                    "numeric": 3693,
                    "alphanumeric": 2238,
                    "binary": 1538,
                    "kanji": 947
                },
                "Q": {
                    "numeric": 2670,
                    "alphanumeric": 1618,
                    "binary": 1112,
                    "kanji": 684
                },
                "H": {
                    "numeric": 2022,
                    "alphanumeric": 1226,
                    "binary": 842,
                    "kanji": 518
                }
            },
            "33": {
                "L": {
                    "numeric": 4965,
                    "alphanumeric": 3009,
                    "binary": 2068,
                    "kanji": 1273
                },
                "M": {
                    "numeric": 3909,
                    "alphanumeric": 2369,
                    "binary": 1628,
                    "kanji": 1002
                },
                "Q": {
                    "numeric": 2805,
                    "alphanumeric": 1700,
                    "binary": 1168,
                    "kanji": 719
                },
                "H": {
                    "numeric": 2157,
                    "alphanumeric": 1307,
                    "binary": 898,
                    "kanji": 553
                }
            },
            "34": {
                "L": {
                    "numeric": 5253,
                    "alphanumeric": 3183,
                    "binary": 2188,
                    "kanji": 1347
                },
                "M": {
                    "numeric": 4134,
                    "alphanumeric": 2506,
                    "binary": 1722,
                    "kanji": 1060
                },
                "Q": {
                    "numeric": 2949,
                    "alphanumeric": 1787,
                    "binary": 1228,
                    "kanji": 756
                },
                "H": {
                    "numeric": 2301,
                    "alphanumeric": 1394,
                    "binary": 958,
                    "kanji": 590
                }
            },
            "35": {
                "L": {
                    "numeric": 5529,
                    "alphanumeric": 3351,
                    "binary": 2303,
                    "kanji": 1417
                },
                "M": {
                    "numeric": 4343,
                    "alphanumeric": 2632,
                    "binary": 1809,
                    "kanji": 1113
                },
                "Q": {
                    "numeric": 3081,
                    "alphanumeric": 1867,
                    "binary": 1283,
                    "kanji": 790
                },
                "H": {
                    "numeric": 2361,
                    "alphanumeric": 1431,
                    "binary": 983,
                    "kanji": 605
                }
            },
            "36": {
                "L": {
                    "numeric": 5836,
                    "alphanumeric": 3537,
                    "binary": 2431,
                    "kanji": 1496
                },
                "M": {
                    "numeric": 4588,
                    "alphanumeric": 2780,
                    "binary": 1911,
                    "kanji": 1176
                },
                "Q": {
                    "numeric": 3244,
                    "alphanumeric": 1966,
                    "binary": 1351,
                    "kanji": 832
                },
                "H": {
                    "numeric": 2524,
                    "alphanumeric": 1530,
                    "binary": 1051,
                    "kanji": 647
                }
            },
            "37": {
                "L": {
                    "numeric": 6153,
                    "alphanumeric": 3729,
                    "binary": 2563,
                    "kanji": 1577
                },
                "M": {
                    "numeric": 4775,
                    "alphanumeric": 2894,
                    "binary": 1989,
                    "kanji": 1224
                },
                "Q": {
                    "numeric": 3417,
                    "alphanumeric": 2071,
                    "binary": 1423,
                    "kanji": 876
                },
                "H": {
                    "numeric": 2625,
                    "alphanumeric": 1591,
                    "binary": 1093,
                    "kanji": 673
                }
            },
            "38": {
                "L": {
                    "numeric": 6479,
                    "alphanumeric": 3927,
                    "binary": 2699,
                    "kanji": 1661
                },
                "M": {
                    "numeric": 5039,
                    "alphanumeric": 3054,
                    "binary": 2099,
                    "kanji": 1292
                },
                "Q": {
                    "numeric": 3599,
                    "alphanumeric": 2181,
                    "binary": 1499,
                    "kanji": 923
                },
                "H": {
                    "numeric": 2735,
                    "alphanumeric": 1658,
                    "binary": 1139,
                    "kanji": 701
                }
            },
            "39": {
                "L": {
                    "numeric": 6743,
                    "alphanumeric": 4087,
                    "binary": 2809,
                    "kanji": 1729
                },
                "M": {
                    "numeric": 5313,
                    "alphanumeric": 3220,
                    "binary": 2213,
                    "kanji": 1362
                },
                "Q": {
                    "numeric": 3791,
                    "alphanumeric": 2298,
                    "binary": 1579,
                    "kanji": 972
                },
                "H": {
                    "numeric": 2927,
                    "alphanumeric": 1774,
                    "binary": 1219,
                    "kanji": 750
                }
            },
            "40": {
                "L": {
                    "numeric": 7089,
                    "alphanumeric": 4296,
                    "binary": 2953,
                    "kanji": 1817
                },
                "M": {
                    "numeric": 5596,
                    "alphanumeric": 3391,
                    "binary": 2331,
                    "kanji": 1435
                },
                "Q": {
                    "numeric": 3993,
                    "alphanumeric": 2420,
                    "binary": 1663,
                    "kanji": 1024
                },
                "H": {
                    "numeric": 3057,
                    "alphanumeric": 1852,
                    "binary": 1273,
                    "kanji": 784
                }
            }
        },
        enumerable: false,
    }
});
