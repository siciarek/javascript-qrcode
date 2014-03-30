String.prototype.bytes = function () {
    'use strict';

    var c;
    var multibyte = false;

    var bytes = [];
    var chars = this.toString().split('');


    for (c = 0; c < chars.length; c += 1) {

        var charcode = chars[c].charCodeAt(0);

        if (charcode > 0x7F) { // Multibyte UTF-8

            var prefs = [ 0x80, 0xC0, 0xE0, 0xF0 ];

            var bt = [];

            while(true) {
                /* jshint bitwise: false */

                if(charcode < prefs[0]) {
                    if(bt.length > 0){
                        charcode |= prefs[bt.length];
                    }

                    bt.unshift(charcode);
                    break;
                }

                var b = charcode;

                b &= 0x3F;
                b |= prefs[0];

                bt.unshift(b);

                charcode >>>= 6;

                /* jshint bitwise: true */
            }

            while(bt.length){
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
