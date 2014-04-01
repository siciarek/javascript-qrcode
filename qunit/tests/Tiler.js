test('Setting Data Area Test', function () {

    var test, expected, actual;

    while(tilerDataProvider.length > 0) {
        test = tilerDataProvider.shift();

        var analyzer = new DataAnalyzer();
        var encoder = new DataEncoder();

        var info = analyzer.analyze(test.data, [test.eclevel]);
        var datastr = encoder.encode(test.data, info.mode, info.version, info.eclevel);

        this.matrix = new Matrix(info.version, info.eclevel);
        this.matrix.setStaticAreas();
        this.matrix.setReservedAreas();
        this.matrix.setDataArea(datastr);

        actual = this.matrix.getData();
        expected = test.matrix;

        deepEqual(actual, expected, [test.data, test.eclevel].toString());
    }
});
