var Mask = function (matrix) {
    'use strict';

    this.matrix = matrix;
    this.config = new Config();
};

Mask.prototype.constructor = Mask;

/**
 * Applies mask
 *
 * @param patternNumber
 * @returns {*}
 */
Mask.prototype.apply = function (patternNumber) {
    'use strict';

    var data = [];
    var maskinfo = {
        evaluator: {},
        data: []
    };
    var formatString, versionInformationString;
    var binnum = parseInt(patternNumber).toString(2);

    while (binnum.length < 3) {
        binnum = '0' + binnum;
    }

    var funct = this.config.maskPatterns[binnum];

    for (var r = 0; r < this.matrix.getSize(); r += 1) {
        maskinfo.data[r] = [];
        for (var c = 0; c < this.matrix.getSize(); c += 1) {
            maskinfo.data[r][c] = this.matrix.data[r][c];
            if (this.matrix.mask[r][c] === this.matrix.MASK_DATA) {
                var val = maskinfo.data[r][c];

                /* jshint bitwise: false */
                maskinfo.data[r][c] = funct(r, c) ? val ^ 1 : val;
                /* jshint bitwise: true */
            }
        }
    }

    formatString = this.config.getFormatString(this.matrix.eclevel, patternNumber);
    versionInformationString = this.config.getVersionInformationString(this.matrix.version);

    this.matrix.setFormatInformationArea(formatString, maskinfo.data);
    this.matrix.setVersionInformationArea(versionInformationString, maskinfo.data);

    var evaluation = new Evaluation(this.matrix);

    maskinfo.evaluation = evaluation.evaluatePattern(maskinfo.data);

    return maskinfo;
};