var Mask = function (matrix) {
    'use strict';

    this.matrix = matrix;
    this.config = new Config();
};

Mask.prototype.constructor = Mask;

/**
 * Applies mask
 *
 * @param {number} pattern
 * @returns {object} mask data and evaluation results.
 */
Mask.prototype.apply = function (pattern) {
    'use strict';

    var maskinfo = {
        evaluation: {},
        data: []
    };

    var pat = this.patterns[pattern];

    for (var r = 0; r < this.matrix.getSize(); r += 1) {
        maskinfo.data[r] = [];
        for (var c = 0; c < this.matrix.getSize(); c += 1) {
            maskinfo.data[r][c] = this.matrix.data[r][c];
            if (this.matrix.mask[r][c] === this.matrix.MASK_DATA) {
                var val = maskinfo.data[r][c];

                /* jshint bitwise: false */
                maskinfo.data[r][c] = pat(r, c) ? val ^ 1 : val;
                /* jshint bitwise: true */
            }
        }
    }

    var formatString = this.config.getFormatString(this.matrix.eclevel, pattern);
    var versionInformationString = this.config.getVersionInformationString(this.matrix.version);

    this.matrix.setFormatInformationArea(formatString, maskinfo.data);
//    this.matrix.setVersionInformationArea(versionInformationString, maskinfo.data);

    var evaluation = new Evaluation(this.matrix);
    maskinfo.evaluation = evaluation.evaluatePattern(maskinfo.data);

    return maskinfo;
};

Mask.prototype.patterns = {

    0: function (row, column) {
        'use strict';
        return (row + column) % 2 === 0;
    },
    1: function (row, column) {
        'use strict';
        return (row) % 2 === 0;
    },
    2: function (row, column) {
        'use strict';
        return (column) % 3 === 0;
    },
    3: function (row, column) {
        'use strict';
        return (row + column) % 3 === 0;
    },
    4: function (row, column) {
        'use strict';
        return (Math.floor(row / 2) + Math.floor(column / 3)) % 2 === 0;
    },
    5: function (row, column) {
        'use strict';
        return ((row * column) % 2) + ((row * column) % 3) === 0;
    },
    6: function (row, column) {
        'use strict';
        return (((row * column) % 2) + ((row * column) % 3)) % 2 === 0;
    },
    7: function (row, column) {
        'use strict';
        return (((row + column) % 2) + ((row * column) % 3)) % 2 === 0;
    }
};