/**
 * Invalid Out Of Range
 */
var OutOfRangeException = function(message) {
    'use strict';

    message = message || 'Value is out of range.';
    this.message = message;
};

OutOfRangeException.prototype.constructor = OutOfRangeException;

OutOfRangeException.prototype.toString = function() {
    'use strict';

    return this.message;
};

/**
 * Not supported mode.
 */
var NotSupportedModeException = function(mode) {
    'use strict';

    this.message = 'Mode ' + mode + ' is not supported.';
};

NotSupportedModeException.prototype.constructor = NotSupportedModeException;

NotSupportedModeException.prototype.toString = function() {
    'use strict';

    return this.message;
};

/**
 * Invalid Error Correction Level
 */
var InvalidErrorCorrectionLevelException = function(message) {
    'use strict';

    message = message || 'Invalid Error Correction Level, only L, M, Q or H is supported.';
    this.message = message;
};

InvalidErrorCorrectionLevelException.prototype.constructor = InvalidErrorCorrectionLevelException;

InvalidErrorCorrectionLevelException.prototype.toString = function() {
    'use strict';

    return this.message;
};

/**
 * Invalid Version Number
 */
var InvalidVersionNumberException = function(message) {
    'use strict';

    message = message || 'Invalid Version number, only 1-40 is supported.';
    this.message = message;
};

InvalidVersionNumberException.prototype.constructor = InvalidVersionNumberException;

InvalidVersionNumberException.prototype.toString = function() {
    'use strict';

    return this.message;
};


/**
 * Empty Data
 */
var EmptyDataException = function(message) {
    'use strict';

    message = message || 'Data should contain at least one character.';
    this.message = message;
};

EmptyDataException.prototype.constructor = EmptyDataException;

EmptyDataException.prototype.toString = function() {
    'use strict';

    return this.message;
};

/**
 * Data out of Range
 */
var DataOutOfRangeException = function(message) {
    'use strict';

    message = message || 'Data size is out of supported range.';
    this.message = message;
};

DataOutOfRangeException.prototype.constructor = DataOutOfRangeException;

DataOutOfRangeException.prototype.toString = function() {
    'use strict';

    return this.message;
};
