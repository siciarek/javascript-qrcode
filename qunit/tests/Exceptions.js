function getOutOfRangeData(mode, eclevel) {
    var config = new Config();
    var range = config.getCapacityRange(mode, eclevel);
    var length = range.max + 1;
    var chars = {
        numeric: '0',
        alphanumeric: 'A',
        binary: 'a'
    };

    return (new Array(length + 1)).join(chars[mode]);
}

var exceptionsDataProvider = [
    {
        data: '',
        eclevel: 'L',
        exception: 'Data should contain at least one character.',
        message: 'Empty string'
    },
    {
        data: null,
        eclevel: 'L',
        exception: 'Data should contain at least one character.',
        message: 'NULL'
    },
    {
        data: '',
        eclevel: 'M',
        exception: 'Data should contain at least one character.',
        message: 'Empty string'
    },
    {
        data: null,
        eclevel: 'M',
        exception: 'Data should contain at least one character.',
        message: 'NULL'
    },
    {
        data: '',
        eclevel: 'Q',
        exception: 'Data should contain at least one character.',
        message: 'Empty string'
    },
    {
        data: null,
        eclevel: 'Q',
        exception: 'Data should contain at least one character.',
        message: 'NULL'
    },
    {
        data: '',
        eclevel: 'H',
        exception: 'Data should contain at least one character.',
        message: 'Empty string'
    },
    {
        data: null,
        eclevel: 'H',
        exception: 'Data should contain at least one character.',
        message: 'NULL'
    },



    {
        data: getOutOfRangeData('numeric', 'L'),
        eclevel: 'L',
        exception: 'Data size is out of supported range.',
        message: 'Out of range - numeric'
    },
    {
        data: getOutOfRangeData('alphanumeric', 'L'),
        eclevel: 'L',
        exception: 'Data size is out of supported range.',
        message: 'Out of range - alphanumeric'
    },
    {
        data: getOutOfRangeData('binary', 'L'),
        eclevel: 'L',
        exception: 'Data size is out of supported range.',
        message: 'Out of range - binary'
    },
    {
        data: getOutOfRangeData('numeric', 'M'),
        eclevel: 'M',
        exception: 'Data size is out of supported range.',
        message: 'Out of range - numeric'
    },
    {
        data: getOutOfRangeData('alphanumeric', 'M'),
        eclevel: 'M',
        exception: 'Data size is out of supported range.',
        message: 'Out of range - alphanumeric'
    },
    {
        data: getOutOfRangeData('binary', 'M'),
        eclevel: 'M',
        exception: 'Data size is out of supported range.',
        message: 'Out of range - binary'
    },
    {
        data: getOutOfRangeData('numeric', 'Q'),
        eclevel: 'Q',
        exception: 'Data size is out of supported range.',
        message: 'Out of range - numeric'
    },
    {
        data: getOutOfRangeData('alphanumeric', 'Q'),
        eclevel: 'Q',
        exception: 'Data size is out of supported range.',
        message: 'Out of range - alphanumeric'
    },
    {
        data: getOutOfRangeData('binary', 'Q'),
        eclevel: 'Q',
        exception: 'Data size is out of supported range.',
        message: 'Out of range - binary'
    },
    {
        data: getOutOfRangeData('numeric', 'H'),
        eclevel: 'H',
        exception: 'Data size is out of supported range.',
        message: 'Out of range - numeric'
    },
    {
        data: getOutOfRangeData('alphanumeric', 'H'),
        eclevel: 'H',
        exception: 'Data size is out of supported range.',
        message: 'Out of range - alphanumeric'
    },
    {
        data: getOutOfRangeData('binary', 'H'),
        eclevel: 'H',
        exception: 'Data size is out of supported range.',
        message: 'Out of range - binary'
    }
];

test('Exceptions Test', function (t) {
    while (exceptionsDataProvider.length > 0) {
        var e = exceptionsDataProvider.shift();
        t.throws(
            function () {
                new QrCode(e.data, [e.eclevel]);
            },
            e.exception,
            [e.message, e.eclevel].toString()
        );
    }
});
