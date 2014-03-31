String.prototype.bytes = function () {
    'use strict';

    var c;

    var bytes = [];
    var chars = this.toString().split('');

    for (c = 0; c < chars.length; c += 1) {

        var charcode = chars[c].charCodeAt(0);

        var multi = false;

        // Json encoding uses UTF-16 like encod
        if (charcode > 0xD800) {
            c += 1;

            multi = true;

            var encoded = [charcode, chars[c].charCodeAt(0)];

            var vh = encoded[0] - 0xD800;
            var vl = encoded[1] - 0xDC00;

            /* jshint bitwise: false */
            var v = vh << 10;
            v |= vl;
            v += 0x10000;
            /* jshint bitwise: true */

            charcode = v;
        }

        var bt = [];

        if (charcode > 0x7F) { // Multibyte UTF-8

            var prefs = [ 0x80, 0xC0, 0xE0, 0xF0, 0xF8, 0xFC ];

            while (true) {
                /* jshint bitwise: false */

                if (multi === true && charcode === 0 || multi === false && charcode < prefs[0]) {
                    if (bt.length > 0) {
                        charcode |= prefs[bt.length];
                    }

                    bt.unshift(charcode);
                    break;
                }

                var b = charcode;

                b &= 0x3F; // get 6 LS bits
                b |= prefs[0];

                bt.unshift(b);

                charcode >>>= 6;

                /* jshint bitwise: true */
            }

            while (bt.length) {
                bytes.push(bt.shift());
            }
        }
        else {
            bytes.push(charcode);
        }
    }

    return bytes;
};

Array.prototype.parseInt = function (radix) {
    'use strict';

    radix = radix || 10;
    return this.map(function (e) {
        return parseInt(e, radix);
    });
};
