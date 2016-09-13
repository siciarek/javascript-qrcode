var Mask = function(matrix) {
    'use strict';

    this.matrix = matrix;
    this.config = new Config();
};

Object.defineProperties(Mask.prototype, {
    'constructor': {
        value: Mask,
        enumerable: false,
    },
    /**
     * Applies mask
     *
     * @param {number} pattern number of specific mask pattern.
     * @param {boolean} maskTest flag to show mask applied on empty grid.
     *
     * @returns {object} mask data and evaluation results.
     */
    'apply': {
        value: function(pattern, maskTest) {
            'use strict';

            maskTest = maskTest || false;

            var maskinfo = {
                evaluation: {},
                data: []
            };

            var pat = this.patterns[pattern];
            var val, r, c;

            if (maskTest === true) {
                for (r = 0; r < this.matrix.data.length; r += 1) {
                    for (c = 0; c < this.matrix.data[r].length; c += 1) {
                        this.matrix.mask[r][c] = this.matrix.MASK_DATA;
                        this.matrix.data[r][c] = 0;
                    }
                }
            }

            for (r = 0; r < this.matrix.getSize(); r += 1) {
                maskinfo.data[r] = [];
                for (c = 0; c < this.matrix.getSize(); c += 1) {
                    maskinfo.data[r][c] = this.matrix.data[r][c];
                    if (this.matrix.mask[r][c] === this.matrix.MASK_DATA) {
                        val = maskinfo.data[r][c];
                        /* jshint bitwise: false */
                        maskinfo.data[r][c] = pat(r, c) ? val ^ 1 : val;
                        /* jshint bitwise: true */
                    }
                }
            }

            if (maskTest === false) {
                var formatString = this.config.getFormatString(this.matrix.eclevel, pattern);
                var versionInformationString = this.config.getVersionInformationString(this.matrix.version);
                this.matrix.setFormatInformationArea(formatString, maskinfo.data);
                this.matrix.setVersionInformationArea(versionInformationString, maskinfo.data);
            }

            var evaluation = new Evaluation(this.matrix);
            maskinfo.evaluation = evaluation.evaluatePattern(maskinfo.data);

            return maskinfo;
        },
        enumerable: false,
    },
    'patterns': {
        value: {

            0: function(row, column) {
                'use strict';
                return (row + column) % 2 === 0;
            },
            1: function(row, column) {
                'use strict';
                return (row) % 2 === 0;
            },
            2: function(row, column) {
                'use strict';
                return (column) % 3 === 0;
            },
            3: function(row, column) {
                'use strict';
                return (row + column) % 3 === 0;
            },
            4: function(row, column) {
                'use strict';
                return (Math.floor(row / 2) + Math.floor(column / 3)) % 2 === 0;
            },
            5: function(row, column) {
                'use strict';
                return ((row * column) % 2) + ((row * column) % 3) === 0;
            },
            6: function(row, column) {
                'use strict';
                return (((row * column) % 2) + ((row * column) % 3)) % 2 === 0;
            },
            7: function(row, column) {
                'use strict';
                return (((row + column) % 2) + ((row * column) % 3)) % 2 === 0;
            }
        },
        enumerable: false,
    },
});
