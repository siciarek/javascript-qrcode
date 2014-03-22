var Tiler = function (matrix) {
    'use strict';

    this.matrix = matrix;

    this.datay = this.matrix.getSize() - 1;
    this.datax = this.matrix.getSize() - 1;
    this.mask = this.matrix.getMask();
    this.data = this.matrix.getData();

    this.UP = -1;
    this.DOWN = 1;

    this.LEFT = -1;
    this.RIGHT = -1;

    this.datadirx = this.LEFT;
    this.datadiry = this.UP;

    this.ending = false;

    this.al = false;
    this.check = [];
};

Tiler.prototype.constructor = Tiler;

Tiler.prototype.setArea = function (datastr) {
    'use strict';

    var limit = -1;

    // <debug>

//    limit = 311;
//    limit += 18;
//
//    limit = 945;
//    limit += 1;

    // </debug>

    var index = 0;

    // Bits array:
    var bits = datastr.split('').map(function (e) {
        return parseInt(e);
    });

    while (bits.length > 0) {

        if(limit > 0 && !(index <= limit)) {
            break;
        }

        var el = bits.shift();

        if (typeof el === 'undefined') {
            break;
        }

        var ret = this.setModule(el, index);

        if (ret === 100) {
            el = bits.shift();
            this.setModule(el, index);
        }

        index += 1;
    }
};

Tiler.prototype.setModule = function (value, index) {
    'use strict';

    var x = this.datax;
    var y = this.datay;

    if (index > 0 && this.al === false) {
        x += index % 2 === 0 ? 0 : this.datadirx;
        y += index % 2 === 0 ? this.datadiry : 0;
    }

    if (typeof this.mask[y] === 'undefined') {
        if (this.datax === 10) {
            this.datadiry = this.datadiry === this.UP ? this.DOWN : this.UP;
            this.datax -= 2;
            this.datay -= 8;

            x = this.datax;
            y = this.datay;

            this.ending = true;
        }
        else {
            this.datadiry = this.datadiry === this.UP ? this.DOWN : this.UP;
            this.datax -= 2;
            x = this.datax;
            y = this.datay;
        }
    }
    else {
        var mval = this.al === true ? this.matrix.MASK_ALIGNMENT_PATTERN : this.mask[y][x];

        if (mval !== this.matrix.MASK_UNDEFINED_MODULE && mval !== this.matrix.MASK_VERSION_INFORMATION_NE) {
            switch (mval) {
                case this.matrix.MASK_SEPARATOR:
                    this.datadiry = this.datadiry === this.UP ? this.DOWN : this.UP;
                    this.datax -= 2;
                    x = this.datax;
                    y = this.datay;
                    break;

                case this.matrix.MASK_FORMAT_INFORMATION:
                case this.matrix.MASK_VERSION_INFORMATION_SW:
                    this.datadiry = this.datadiry === this.UP ? this.DOWN : this.UP;

                    if (this.ending === true) {
                        this.datay = 9;
                        this.datax -= 3;
                        x = this.datax;
                        y = this.datay;
                        this.ending = false;
                    }
                    else {
                        this.datax -= 2;
                        x = this.datax;
                        y = this.datay;
                    }
                    break;

                case this.matrix.MASK_TOP_TIMER:
                    x = this.datax;
                    y = this.datay + (this.datadiry === this.UP ? -2 : 2);
                    break;

                case this.matrix.MASK_ALIGNMENT_PATTERN:

                    if (this.datadiry === this.UP && this.data[y][x - 1] === this.matrix.DATA_UNDEFINED_MODULE) {
                        this.datay -= (index % 2 === 0 ? 1 : 1);
                        this.datax -= (this.al === false && index % 2 === 0 ? 1 : 0);

                        if(this.mask[this.datay][x] === this.matrix.MASK_TOP_TIMER) {
                            this.datay -= 1;
                        }

                        this.al = true;

                        y = this.datay;
                        x = this.datax;

                        break;
                    }

                    x = this.datax;
                    y = this.datay + (this.datadiry === this.UP ? -6 : 6);

                    break;
                default:
                    return 1;
            }
        }
    }

    if (value === 1) {
        this.matrix.setDarkModule(x, y, this.matrix.MASK_DATA);
    }
    else {
        this.matrix.setLightModule(x, y, this.matrix.MASK_DATA);
    }

    if (this.al === true && this.mask[y - 1][x + 1] === this.matrix.MASK_UNDEFINED_MODULE) {
        this.al = false;
        this.datax += 1;
        return 100;
    }

    this.datay = y;
    return 1;
};
