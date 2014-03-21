var ErrorCorrection = function () {
    'use strict';

    this.config = new Config();
    this.gen = new GeneratorPolynominal();
};

ErrorCorrection.prototype.constructor = ErrorCorrection;

ErrorCorrection.prototype.getCode = function (data, version, eclevel) {
    'use strict';

    var numberOfEcCodewords = parseInt(this.config.dataSizeInfo['' + version + '-' + eclevel][1]);

    var genpn = this.gen.polynominal(numberOfEcCodewords);
    var result = [];
    result = result.concat(data);

    for (var s = 0; s < data.length; s += 1) {
        var lterm = this.gen.int2exp(result[0]) % 255;

        for (var i = 0; i < genpn.length; i += 1) {
            var exp = (genpn[i] + lterm) % 255;

            exp = this.gen.exp2int(exp);

            /* jshint bitwise: false */
            result[i] = result[i] ^ exp;
            /* jshint bitwise: true */
        }

        result.shift();
    }

    return result;
};
