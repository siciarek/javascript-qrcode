String.prototype.bytes = function () {
    'use strict';

    var c;
    var multibyte = false;

    var bytes = [];
    var chars = this.toString().split('');

    for (c = 0; c < chars.length; c += 1) {
        if(chars[c].charCodeAt(0) > 0xFF) {
            multibyte = true;
        }
    }

    for (c = 0; c < chars.length; c += 1) {

        var char = chars[c];
        var charcode = chars[c].charCodeAt(0);

        if (multibyte === true && charcode > 0x7F) {

            var val = charcode.toString(16);

            while (val.length % 2) {
                val = '0' + val;
            }

            /* jshint bitwise: false */
            var l = charcode >>> 6;
            var r = parseInt(charcode.toString(2).replace(new RegExp('^' + l.toString(2)), ''), 2);
            l |= 0xC0;
            r |= 0x80;
            /* jshint bitwise: true */

            bytes.push(l);
            bytes.push(r);
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
