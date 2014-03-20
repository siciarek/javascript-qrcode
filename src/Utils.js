Array.prototype.parseInt = function(radix) {
    'use strict';

    radix = radix || 10;
    return this.map(function(e){ return parseInt(e, radix); });
};
