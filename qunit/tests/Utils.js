var utilsDataProvider = [
    { data: '😺😄😐', expected: [0xF0, 0x9f, 0x98, 0xba, 0xF0, 0x9f, 0x98, 0x84, 0xF0, 0x9f, 0x98, 0x90], message: 'UTF-8 Emoticons.' },
    { data: '川月木心火左北今名美見外成空明静海雲新語道聞強飛', expected: [229, 183, 157, 230, 156, 136, 230, 156, 168, 229, 191, 131, 231, 129, 171, 229, 183, 166, 229, 140, 151, 228, 187, 138, 229, 144, 141, 231, 190, 142, 232, 166, 139, 229, 164, 150, 230, 136, 144, 231, 169, 186, 230, 152, 142, 233, 157, 153, 230, 181, 183, 233, 155, 178, 230, 150, 176, 232, 170, 158, 233, 129, 147, 232, 129, 158, 229, 188, 183, 233, 163, 155], message: 'Kanji.' },

    { data: '$¢€𤭢', expected: [0x24, 0xC2, 0xA2, 0xE2, 0x82, 0xAC, 0xF0, 0xA4, 0xAD, 0xA2], message: 'Mixed number of bytes per character.' },
    { data: '\uD83D\uDEB9', expected: [0xf0, 0x9f, 0x9a, 0xb9], message: 'MENS SYMBOL, Four bytes special character - JSON encoded.' },
    { data: '🚹', expected: [0xf0, 0x9f, 0x9a, 0xb9], message: 'MENS SYMBOL, Four bytes special character - raw.' },
    { data: '𤭢', expected: [0xF0, 0xA4, 0xAD, 0xA2], message: 'Four bytes special character.' },
    { data: '€', expected: [0xE2, 0x82, 0xAC], message: 'Three bytes special character.' },
    { data: '¢', expected: [0xC2, 0xA2], message: 'Two bytes special character.' },
    { data: '$', expected: [0x24], message: 'One byte special character.' },
    { data: 'abcdefg', expected: [0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67], message: 'One byte chars sequence.' }
];

test('Utils Test', function () {

    var test, expected, actual;

    while (utilsDataProvider.length > 0) {
        test = utilsDataProvider.shift();
        actual = test.data.bytes();
        expected = test.expected;

        deepEqual(actual, expected, [test.data, test.message].toString());
    }
});
