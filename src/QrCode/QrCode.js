/**
 * Quick Response Model 2 Code generator
 *
 * @param data raw data, default 'QRCODE'
 * @param ecstrategy error correction strategy, default ['M']
 * @param maskPattern force mask pattern, default null
 * @constructor
 */
var QrCode = function (data, ecstrategy, maskPattern, version) {
    'use strict';

    data = data || 'QRCODE';
    ecstrategy = ecstrategy || ['M'];
    maskPattern = maskPattern || null;
    version = version || null;

    this.info = {};

    var analyzer = new DataAnalyzer(version);
    this.info = analyzer.analyze(data, ecstrategy);

    var encoder = new DataEncoder();
    var errcorrection = new ErrorCorrection();
    var tiler, evaluator, mask;
    var formatString, versionInformationString;
    var maskinfo = {};

    var encdata = encoder.encode(this.info.data, this.info.version, this.info.mode, this.info.eclevel);
    var ecc = errcorrection.getCode(encdata, this.info.version, this.info.eclevel);

    this.matrix = new Matrix(this.info.version, this.info.eclevel);
    this.matrix.setStaticAreas();
    this.matrix.setReservedAreas();

    tiler = new Tiler(this.matrix);
    tiler.setArea(encdata, ecc);

    mask = new Mask(this.matrix);

    var pattern = 0;

    if (maskPattern === null) {
        var results = [];
        var evaluations = {};
        var temp = [];

        for (pattern = 0; pattern < 8; pattern += 1) {
            maskinfo = mask.apply(pattern);
            results.push(maskinfo.evaluation.total);
            evaluations[results[pattern]] = pattern;
        }

        results = results.sort();
        pattern = evaluations[results[0]];
    }
    else {
        pattern = parseInt(maskPattern);
        pattern = isNaN(pattern) ? 0 : pattern;
    }

    this.info.pattern = pattern;

    maskinfo = mask.apply(pattern, this.matrix.data);
    this.matrix.data = maskinfo.data;
};

QrCode.prototype.getInfo = function () {
    'use strict';

    return this.info;
};

QrCode.prototype.getData = function () {
    'use strict';

    return this.matrix.getData();
};

QrCode.prototype.getSize = function () {
    'use strict';

    return this.matrix.getSize();
};
