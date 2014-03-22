/**
 * Quick Response Model 2 Code generator
 *
 * @param {string} data raw data, default 'QRCODE'
 * @param {array} ecstrategy error correction strategy, default ['M']
 * @param {number|null} maskPattern force mask pattern, default null
 * @param {number} version version number
 * @constructor
 */
var QrCode = function (data, ecstrategy, maskPattern, version) {
    'use strict';

    data = data || 'QRCODE';
    ecstrategy = ecstrategy || ['M'];
    maskPattern = maskPattern || null;
    version = version || null;

    this.info = {};

    var analyzer, encoder, tiler, mask;
    var datastr;
    var maskinfo = {};
    var pattern = 0;

    analyzer = new DataAnalyzer(version);
    this.info = analyzer.analyze(data, ecstrategy);

    encoder = new DataEncoder();
    datastr = encoder.encode(data, this.info.mode, this.info.version, this.info.eclevel);

    this.matrix = new Matrix(this.info.version, this.info.eclevel);
    this.matrix.setStaticAreas();
    this.matrix.setReservedAreas();

    tiler = new Tiler(this.matrix);
    tiler.setArea(datastr);

    mask = new Mask(this.matrix);

    if (maskPattern === null) {
        var results = [];
        var evaluations = {};

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
    this.info.datalen = this.info.data.length;

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
