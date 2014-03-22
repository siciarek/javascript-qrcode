var dataEncoderDataProvider = [
    [
        // http://www.thonky.com/qr-code-tutorial/data-encoding/
        {
            input: {
                message: 'HELLO WORLD',
                version: 1,
                mode: 'alphanumeric',
                ecLevel: 'M'
            },
            expected: [ 32, 91, 11, 120, 209, 114, 220, 77, 67, 64, 236, 17, 236, 17, 236, 17 ]
        },
        {
            input: {
                message: 'HELLO WORLD',
                version: 1,
                mode: 'alphanumeric',
                ecLevel: 'Q'
            },
            expected: [ 32, 91, 11, 120, 209, 114, 220, 77, 67, 64, 236, 17, 236 ]
        },
        // http://www.swetake.com/qrcode/qr2_en.html
        {
            input: {
                message: 'ABCDE123',
                version: 1,
                mode: 'alphanumeric',
                ecLevel: 'H'
            },
            expected: [ 32, 65, 205, 69, 41, 220, 46, 128, 236 ]
        }
    ],
    [
        {
            mode: 'numeric',
            data: '8675309',
            expected: [
                '1101100011', '1000010010', '1001'
            ]
        },
        {
            mode: 'alphanumeric',
            data: 'HELLO WORLD',
            expected: [
                '01100001011', '01111000110', '10001011100', '10110111000', '10011010100', '001101'
            ]
        },
        {
            mode: 'binary',
            data: 'Hello, world!',
            expected: [
                '01001000', '01100101', '01101100', '01101100', '01101111', '00101100', '00100000', '01110111', '01101111', '01110010', '01101100', '01100100', '00100001'
            ]
        }
    ]
];

test('Data Encoder Test', function () {
    var test, expected, actual;
    var de = new DataEncoder();

    while (dataEncoderDataProvider[0].length > 0) {
        test = dataEncoderDataProvider[0].shift();
        actual = de.encodeData(test.input.message, test.input.mode, test.input.version, test.input.ecLevel);
        deepEqual(actual, test.expected, [test.input.message, test.input.mode, test.input.version, test.input.ecLevel].toString());
    }

    while (dataEncoderDataProvider[1].length > 0) {
        test = dataEncoderDataProvider[1].shift();
        actual = [];
        expected = test.expected;

        switch (test.mode) {
            case 'numeric':
                actual = de.encodeNumeric(test.data);
                break;
            case 'alphanumeric':
                actual = de.encodeAlphanumeric(test.data);
                break;
            case 'binary':
                actual = de.encodeBinary(test.data);
                break;
        }

        deepEqual(actual, expected, [test.data, test.mode].toString());
    }

});