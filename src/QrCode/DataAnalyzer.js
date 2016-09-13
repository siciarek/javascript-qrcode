/**
 * Data Analyzer
 *
 * @param {number} version
 * @constructor
 */
var DataAnalyzer = function(version) {
    'use strict';

    this.config = new Config();
    this.encoder = new DataEncoder();
    this.version = version || null;
    this.version = parseInt(this.version);
    this.version = isNaN(this.version) ? null : parseInt(this.version);

};

Object.defineProperties(DataAnalyzer.prototype, {
    'constructor': {
        value: DataAnalyzer,
        enumerable: false,
    },
    'modes': {
        value: {
            numeric: function(data, self) {
                'use strict';

                return data.match(/^\d+$/) !== null;
            },
            alphanumeric: function(data, self) {
                'use strict';

                var chars = data.split('').sort().filter(function(el, i, array) {
                    return (i === array.indexOf(el) && el.length > 0);
                });

                while (chars.length > 0) {
                    if (typeof self.encoder.alphanumericCharsTable[chars.shift()] === 'undefined') {
                        return false;
                    }
                }

                return true;
            },
            kanji: function(data, self) {
                'use strict';

                return false; // TODO: do the research and implement
            }
        },
        enumerable: false,
    },
    'analyze': {
        value: function(data, eclevels) {
            'use strict';

            data = data || '';
            var data_length = data.bytes().length;

            var defaultEcLevels = ['H', 'Q', 'M', 'L'];

            if (data_length === 0) {
                throw new EmptyDataException();
            }

            eclevels = eclevels || defaultEcLevels;

            var result = {
                data: data,
                capacity: 0,
                datalen: data_length,
                mode: 'binary',
                eclevel: null,
                version: 2
            };

            for (var mode in this.modes) {
                if (this.modes.hasOwnProperty(mode)) {
                    var matches = this.modes[mode](data, this);
                    if (matches) {
                        result.mode = mode;
                        break;
                    }
                }
            }

            var outOfRange = true;

            for (var i = 0; i < eclevels.length; i += 1) {
                var range = this.config.getCapacityRange(result.mode, eclevels[i]);
                if (data_length >= range.min && data_length <= range.max) {
                    outOfRange = false;
                    break;
                }
            }

            if (outOfRange === true) {
                throw new DataOutOfRangeException();
            }

            for (var version in this.config.characterCapacities) {
                if (this.config.characterCapacities.hasOwnProperty(version)) {

                    if (this.version !== null && parseInt(version) !== this.version) {
                        continue;
                    }

                    for (var c = 0; c < eclevels.length; c += 1) {
                        var eclevel = eclevels[c];
                        var capacity = this.config.characterCapacities[version][eclevel][result.mode];

                        if (data_length <= capacity) {
                            result.capacity = capacity;
                            result.eclevel = eclevel;
                            result.version = parseInt(version);
                            break;
                        }
                    }

                    if (result.capacity > 0) {
                        break;
                    }

                }
            }

            return result;
        },
        enumerable: false,
    },
});
