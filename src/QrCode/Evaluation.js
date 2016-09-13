var Evaluation = function(matrix) {
    'use strict';

    this.matrix = matrix;
};

Object.defineProperties(Evaluation.prototype, {
    'constructor': {
        value: Evaluation,
        enumerable: false,
    },
    'evaluatePattern': {
        value: function(data) {
            'use strict';

            var result = {
                total: 0,
                1: 0,
                2: 0,
                3: 0,
                4: 0
            };

            for (var cond in this.rules) {
                if (this.rules.hasOwnProperty(cond)) {
                    var c = parseInt(cond);
                    var res = this.rules[c](data);
                    result[c] = res.total;
                    result.total += result[c];
                }
            }

            return result;
        },
        enumerable: false,
    },
    'rules': {
        value: {
            1: function(data) {
                'use strict';

                /**
                 * The first rule gives the QR code a penalty
                 * for each group of five or more same-colored modules in a row (or column).
                 */
                var result = {
                    horizontal: 0,
                    vertical: 0,
                    total: 0
                };

                var r, c, f, found, penalty, totest;

                // rows:

                for (r = 0; r < data.length; r += 1) {
                    penalty = 0;
                    totest = data[r].join('');

                    found = totest.match(/(0{5,}|1{5,})/g);

                    if (found !== null) {
                        for (f = 0; f < found.length; f += 1) {
                            penalty += (3 + found[f].length - 5);
                        }
                    }

                    result.horizontal += penalty;
                }

                // columns:

                for (c = 0; c < data.length; c += 1) {
                    penalty = 0;
                    totest = '';

                    for (r = 0; r < data[0].length; r += 1) {
                        totest += data[r][c];
                    }

                    found = totest.match(/(0{5,}|1{5,})/g);

                    if (found !== null) {
                        for (f = 0; f < found.length; f += 1) {
                            penalty += (3 + found[f].length - 5);
                        }
                    }

                    result.vertical += penalty;
                }

                result.total = result.horizontal + result.vertical;

                return result;
            },

            2: function(data) {
                'use strict';

                /**
                 * The second rule gives the QR code a penalty
                 * for each 2x2 area of same-colored modules in the matrix.
                 */
                var result = {
                    found: 0,
                    total: 0
                };

                var penalty = 3;

                var r, c;

                for (r = 0; r < data.length - 1; r += 1) {
                    for (c = 0; c < data[0].length - 1; c += 1) {
                        if (data[r][c] === data[r][c + 1] && data[r][c] === data[r + 1][c] && data[r][c] === data[r + 1][c + 1]) {
                            result.found += 1;
                        }
                    }
                }

                result.total = result.found * penalty;

                return result;
            },

            3: function(data) {
                'use strict';

                /**
                 * The third rule gives the QR code a large penalty
                 * if there are patterns that look similar to the finder patterns.
                 *
                 * (1 x dark: 1 x bright: 3 x dark: 1 x bright: 1 x dark) pattern (and reversed) in a line or a column
                 * [ 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0 ]
                 * [ 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1 ]
                 */
                var result = {
                    cols: 0,
                    rows: 0,
                    total: 0
                };

                var patterns = [
                    [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1]
                ];

                var penalty = 40;

                var match = true;
                var r, c, p;

                // Rows:
                for (r = 0; r < data.length; r += 1) {
                    for (c = 0; c < data[0].length - patterns[0].length + 1; c += 1) {
                        match = [true, true];

                        for (p = 0; p < patterns[0].length; p += 1) {
                            if (data[r][c + p] !== patterns[0][p]) {
                                match[0] = false;
                            }
                            if (data[r][c + p] !== patterns[1][p]) {
                                match[1] = false;
                            }
                        }

                        if (match[0] === true) {
                            result.rows += 1;
                        }

                        if (match[1] === true) {
                            result.rows += 1;
                        }
                    }
                }

                // Cols:
                for (c = 0; c < data[0].length; c += 1) {
                    for (r = 0; r < data.length - patterns[0].length + 1; r += 1) {
                        match = [true, true];

                        for (p = 0; p < patterns[0].length; p += 1) {
                            if (data[r + p][c] !== patterns[0][p]) {
                                match[0] = false;
                            }
                            if (data[r + p][c] !== patterns[1][p]) {
                                match[1] = false;
                            }
                        }

                        if (match[0] === true) {
                            result.cols += 1;
                        }

                        if (match[1] === true) {
                            result.cols += 1;
                        }
                    }
                }

                result.total = (result.rows + result.cols) * penalty;

                return result;
            },

            4: function(data) {
                'use strict';

                /**
                 * The fourth rule gives the QR code a penalty
                 * if more than half of the modules are dark or light, with a larger penalty for a larger difference.
                 */
                var result = {
                    dark: 0,
                    all: 0,
                    total: 0
                };

                var penalty = 10;

                var r, c;

                for (r = 0; r < data.length; r += 1) {
                    for (c = 0; c < data[0].length; c += 1) {
                        result.dark += data[r][c] === 1 ? 1 : 0;
                        result.all += 1;
                    }
                }

                var percentage = (result.dark / result.all) * 100;

                var fivemul = {
                    upper: 0,
                    lower: 0
                };

                while (fivemul.upper < percentage) {
                    fivemul.upper += 5;
                }

                fivemul.lower = fivemul.upper - 5;

                var a = Math.abs(fivemul.lower - 50);
                var b = Math.abs(fivemul.upper - 50);

                result.total = Math.min(a, b) * penalty;

                return result;
            }
        },
        enumerable: false,
    },
});
