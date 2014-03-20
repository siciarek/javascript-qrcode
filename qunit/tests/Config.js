var configFormatStringDataProvider = {
    L: [
        '111011111000100',
        '111001011110011',
        '111110110101010',
        '111100010011101',
        '110011000101111',
        '110001100011000',
        '110110001000001',
        '110100101110110'
    ],
    M: [
        '101010000010010',
        '101000100100101',
        '101111001111100',
        '101101101001011',
        '100010111111001',
        '100000011001110',
        '100111110010111',
        '100101010100000'
    ],
    Q: [
        '011010101011111',
        '011000001101000',
        '011111100110001',
        '011101000000110',
        '010010010110100',
        '010000110000011',
        '010111011011010',
        '010101111101101'
    ],
    H: [
        '001011010001001',
        '001001110111110',
        '001110011100111',
        '001100111010000',
        '000011101100010',
        '000001001010101',
        '000110100001100',
        '000100000111011'
    ]
};

var configVersionInformationStringDataProvider = {
    7: '000111110010010100',
    8: '001000010110111100',
    9: '001001101010011001',
    10: '001010010011010011',
    11: '001011101111110110',
    12: '001100011101100010',
    13: '001101100001000111',
    14: '001110011000001101',
    15: '001111100100101000',
    16: '010000101101111000',
    17: '010001010001011101',
    18: '010010101000010111',
    19: '010011010100110010',
    20: '010100100110100110',
    21: '010101011010000011',
    22: '010110100011001001',
    23: '010111011111101100',
    24: '011000111011000100',
    25: '011001000111100001',
    26: '011010111110101011',
    27: '011011000010001110',
    28: '011100110000011010',
    29: '011101001100111111',
    30: '011110110101110101',
    31: '011111001001010000',
    32: '100000100111010101',
    33: '100001011011110000',
    34: '100010100010111010',
    35: '100011011110011111',
    36: '100100101100001011',
    37: '100101010000101110',
    38: '100110101001100100',
    39: '100111010101000001',
    40: '101000110001101001'
};

var actual, expected;
var config = new Config();

test('Config Test (Format String)', function () {

    for (var correctionLevel in configFormatStringDataProvider) {
        if(configFormatStringDataProvider.hasOwnProperty(correctionLevel)) {
            var patterns = configFormatStringDataProvider[correctionLevel];
            for(var p = 0; p < patterns.length; p++) {

                actual = config.getFormatString(correctionLevel, p);
                expected = configFormatStringDataProvider[correctionLevel][p];

                ok(typeof actual !== 'undefined', ['defined', correctionLevel, p].toString());
                deepEqual(actual, expected, ['proper', correctionLevel, p].toString());
            }
       }
    }
});

test('Config Test (Version Information)', function () {

    for (var version in configVersionInformationStringDataProvider) {
        if(configVersionInformationStringDataProvider.hasOwnProperty(version)) {
            actual = config.getVersionInformationString(version);
            expected = configVersionInformationStringDataProvider[version];

            ok(typeof actual !== 'undefined', ['defined', version].toString());
            deepEqual(actual, expected, ['proper', version].toString());
        }
    }
});