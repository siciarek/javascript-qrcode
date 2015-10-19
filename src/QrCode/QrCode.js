/**
 * Quick Response Model 2 Code generator
 *
 * @param {string} data raw data
 * @param {array} ecstrategy error correction strategy, default ['M']
 * @param {number|null} maskPattern force mask pattern, default null
 * @param {number} version version number
 * @param {boolean} dataOnly if no mask is to be applied
 * @param {boolean} maskTest shows only mask
 *
 * @throws {string} Out of range Exception
 *
 * @constructor
 */
var QrCode = function (data, ecstrategy, maskPattern, version, dataOnly, maskTest) {
    'use strict';

    data = data || '';
    ecstrategy = ecstrategy || ['M'];
    version = version || null;
    dataOnly = dataOnly || false;
    maskTest = maskTest || false;

    // Error correction validation:

    if(ecstrategy.constructor !== Array) {
        throw new InvalidErrorCorrectionLevelException();
    }

    ecstrategy.forEach(function(e){
        if(e.match(/^[LMQH]$/i) === null) {
            throw new InvalidErrorCorrectionLevelException();
        }
    });

    // Mask pattern validation:

    if(typeof parseInt(maskPattern) !== 'number') {
        maskPattern = null;
    }
    else {
        maskPattern = parseInt(maskPattern);
    }

    if(isNaN(maskPattern)) {
        maskPattern = null;
    }

    if(maskPattern !== null && !(maskPattern >=0 && maskPattern < 8)) {
        throw new OutOfRangeException('Mask pattern value is out of 0..7 range.');
    }

    // Version validation:

    if(version !== null && typeof parseInt(version) !== 'number') {
        throw new InvalidVersionNumberException();
    }

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
    this.matrix.setDataArea(datastr);

    if(dataOnly === true) {
        return;
    }

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

    maskinfo = mask.apply(pattern, maskTest);
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
