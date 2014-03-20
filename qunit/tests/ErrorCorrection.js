var errorCorrectionDataProvider = [
    {
        input: {
            version: 1,
            data: [32, 91, 11, 120, 209, 114, 220, 77, 67, 64, 236, 17, 236, 17, 236, 17, 236, 17, 236],
            eclevel: 'L'
        },
        expected: [209, 239, 196, 207, 78, 195, 109]
    },
    {
        input: {
            version: 1,
            data: [32, 91, 11, 120, 209, 114, 220, 77, 67, 64, 236, 17, 236, 17, 236, 17],
            eclevel: 'M'
        },
        expected: [196, 35, 39, 119, 235, 215, 231, 226, 93, 23]
    },
    {
        input: {
            version: 1,
            data: [32, 91, 11, 120, 209, 114, 220, 77, 67, 64, 236, 17, 236],
            eclevel: 'Q'
        },
        expected: [168, 72, 22, 82, 217, 54, 156, 0, 46, 15, 180, 122, 16]
    }
];

test('Error Correction Test', function () {
    var ec = new ErrorCorrection();

    while (errorCorrectionDataProvider.length > 0) {
        var test = errorCorrectionDataProvider.shift();
        var actual = ec.getCode(test.input.data, test.input.version, test.input.eclevel);
        deepEqual(actual, test.expected, 'eclevel length ' + test.input.eclevel);
    }
});