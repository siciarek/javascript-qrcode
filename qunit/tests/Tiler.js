test('Tiler Test', function () {

    var test, expected, actual;

    while(tilerDataProvider.length > 0) {
        test = tilerDataProvider.shift();

        var analyzer = new DataAnalyzer();
        var encoder = new DataEncoder();
        var errcorrection = new ErrorCorrection();

        var info = analyzer.analyze(test.data, [test.eclevel]);
        var encdata = encoder.encode(info.data, info.version, info.mode, info.eclevel);
        var ecc = errcorrection.getCode(encdata, info.version, info.eclevel);

        this.matrix = new Matrix(info.version);
        this.matrix.setStaticAreas();
        this.matrix.setReservedAreas();

        var tiler = new Tiler(this.matrix);
        tiler.setArea(encdata, ecc);

        actual = this.matrix.getData();
        expected = test.matrix;

        deepEqual(actual, expected, [test.data, test.eclevel].toString());
    }
});
