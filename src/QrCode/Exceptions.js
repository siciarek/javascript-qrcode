/**
 * Invalid Out Of Range
 */
var OutOfRangeException = function(message) {
    'use strict';

    message = message || 'Value is out of range.';
    this.message = message;
};

Object.defineProperties(OutOfRangeException.prototype, {
    'constructor': {
        value: OutOfRangeException,
        enumerable: false,
    },
    'toString': {
        value: function() {
            'use strict';

            return this.message;
        },
        enumerable: false,
    }
});

/**
 * Not supported mode.
 */
var NotSupportedModeException = function(mode) {
    'use strict';

    this.message = 'Mode ' + mode + ' is not supported.';
};

Object.defineProperties(NotSupportedModeException.prototype, {
    'constructor': {
        value: NotSupportedModeException,
        enumerable: false,
    },
    'toString': {
        value: function() {
            'use strict';

            return this.message;
        },
        enumerable: false,
    }
});

/**
 * Invalid Error Correction Level
 */
var InvalidErrorCorrectionLevelException = function(message) {
    'use strict';

    message = message || 'Invalid Error Correction Level, only L, M, Q or H is supported.';
    this.message = message;
};

Object.defineProperties(InvalidErrorCorrectionLevelException.prototype, {
    'constructor': {
        value: InvalidErrorCorrectionLevelException,
        enumerable: false,
    },
    'toString': {
        value: function() {
            'use strict';

            return this.message;
        },
        enumerable: false,
    }
});

/**
 * Invalid Version Number
 */
var InvalidVersionNumberException = function(message) {
    'use strict';

    message = message || 'Invalid Version number.';
    this.message = message;
};

Object.defineProperties(InvalidVersionNumberException.prototype, {
    'constructor': {
        value: InvalidVersionNumberException,
        enumerable: false,
    },
    'toString': {
        value: function() {
            'use strict';

            return this.message;
        },
        enumerable: false,
    }
});

/**
 * Empty Data
 */
var EmptyDataException = function(message) {
    'use strict';

    message = message || 'Data should contain at least one character.';
    this.message = message;
};

Object.defineProperties(EmptyDataException.prototype, {
    'constructor': {
        value: EmptyDataException,
        enumerable: false,
    },
    'toString': {
        value: function() {
            'use strict';

            return this.message;
        },
        enumerable: false,
    }
});

/**
 * Data out of Range
 */
var DataOutOfRangeException = function(message) {
    'use strict';

    message = message || 'Data size is out of supported range.';
    this.message = message;
};
Object.defineProperties(DataOutOfRangeException.prototype, {
    'constructor': {
        value: DataOutOfRangeException,
        enumerable: false,
    },
    'toString': {
        value: function() {
            'use strict';

            return this.message;
        },
        enumerable: false,
    }
});
