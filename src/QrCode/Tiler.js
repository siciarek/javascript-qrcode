var Tiler = function (matrix) {
    'use strict';

    this.matrix = matrix;

    this.cursor = {
        x: this.matrix.getSize() - 1,
        y: this.matrix.getSize() - 1
    };

    this.mask = this.matrix.getMask();
    this.data = this.matrix.getData();
};

Tiler.prototype.constructor = Tiler;

Tiler.prototype.writeBit = function (bit) {
    'use strict';

    if (bit === 1) {
        this.matrix.setDarkModule(this.cursor.x, this.cursor.y, this.matrix.MASK_DATA);
    }
    else {
        this.matrix.setLightModule(this.cursor.x, this.cursor.y, this.matrix.MASK_DATA);
    }

    if(this.cursor.x === 7 && this.cursor.y === 9) {
        throw '7-9';
    }
};

Tiler.prototype.setArea = function (datastr) {
    'use strict';

    // Bits array:
    var bits = datastr.split('').map(function (e) {
        return parseInt(e);
    });

    var index = 0;
    var offix, bit;
    var limit = bits.length;

    limit -= 1;

    var tempy = 0;

    var offsets = [
        [
            [-1, 0],
            [1, -1]
        ],
        [
            [-1, 0],
            [1, 1]
        ]
    ];

    try {
        while (bits.length > 0) {

            if (index >= limit) {
                break;
            }

            offix = 0;

            while (bits.length > 0) {

                if (typeof this.mask[this.cursor.y] === 'undefined' || this.mask[this.cursor.y][this.cursor.x] === 'undefined') {
                    break;
                }

                if (this.data[this.cursor.y][this.cursor.x] === this.matrix.DATA_UNDEFINED_MODULE) {
                    bit = bits.shift();
                    this.writeBit(bit);

                    index += 1;
                    if (index >= limit) {
                        break;
                    }
                }

                tempy = this.cursor.y;
                this.cursor.x += offsets[offix][0][0];
                this.cursor.y += offsets[offix][0][1];

                if (typeof this.mask[this.cursor.y] === 'undefined' || this.mask[this.cursor.y][this.cursor.x] === 'undefined') {
                    break;
                }


                if (this.data[this.cursor.y][this.cursor.x] === this.matrix.DATA_UNDEFINED_MODULE) {
                    bit = bits.shift();
                    this.writeBit(bit);

                    index += 1;
                    if (index >= limit) {
                        break;
                    }
                }

                tempy = this.cursor.y;
                this.cursor.x += offsets[offix][1][0];
                this.cursor.y += offsets[offix][1][1];

                if (typeof this.mask[this.cursor.y] === 'undefined' || this.mask[this.cursor.y][this.cursor.x] === 'undefined') {
                    break;
                }


                if (this.data[this.cursor.y][this.cursor.x] === this.matrix.DATA_UNDEFINED_MODULE) {
                    bit = bits.shift();
                    this.writeBit(bit);

                    index += 1;
                    if (index >= limit) {
                        break;
                    }
                }

                tempy = this.cursor.y;
                this.cursor.x += offsets[offix][0][0];
                this.cursor.y += offsets[offix][0][1];

                if (typeof this.mask[this.cursor.y] === 'undefined' || this.mask[this.cursor.y][this.cursor.x] === 'undefined') {
                    break;
                }


                if (this.data[this.cursor.y][this.cursor.x] === this.matrix.DATA_UNDEFINED_MODULE) {
                    bit = bits.shift();
                    this.writeBit(bit);

                    index += 1;
                    if (index >= limit) {
                        break;
                    }
                }

                tempy = this.cursor.y;
                this.cursor.x += offsets[offix][1][0];
                this.cursor.y += offsets[offix][1][1];
            }

            if (index >= limit) {
                break;
            }

            this.cursor.x += -2;
            this.cursor.y = tempy;

            offix = 1;

            while (bits.length > 0) {

                if (typeof this.mask[this.cursor.y] === 'undefined' || this.mask[this.cursor.y][this.cursor.x] === 'undefined') {
                    break;
                }

                if (this.data[this.cursor.y][this.cursor.x] === this.matrix.DATA_UNDEFINED_MODULE) {
                    bit = bits.shift();
                    this.writeBit(bit);

                    index += 1;
                    if (index >= limit) {
                        break;
                    }
                }

                tempy = this.cursor.y;
                this.cursor.x += offsets[offix][0][0];
                this.cursor.y += offsets[offix][0][1];

                if (typeof this.mask[this.cursor.y] === 'undefined' || this.mask[this.cursor.y][this.cursor.x] === 'undefined') {
                    break;
                }


                if (this.data[this.cursor.y][this.cursor.x] === this.matrix.DATA_UNDEFINED_MODULE) {
                    bit = bits.shift();
                    this.writeBit(bit);

                    index += 1;
                    if (index >= limit) {
                        break;
                    }
                }

                tempy = this.cursor.y;
                this.cursor.x += offsets[offix][1][0];
                this.cursor.y += offsets[offix][1][1];

                if (typeof this.mask[this.cursor.y] === 'undefined' || this.mask[this.cursor.y][this.cursor.x] === 'undefined') {
                    break;
                }


                if (this.data[this.cursor.y][this.cursor.x] === this.matrix.DATA_UNDEFINED_MODULE) {
                    bit = bits.shift();
                    this.writeBit(bit);

                    index += 1;
                    if (index >= limit) {
                        break;
                    }
                }

                tempy = this.cursor.y;
                this.cursor.x += offsets[offix][0][0];
                this.cursor.y += offsets[offix][0][1];

                if (typeof this.mask[this.cursor.y] === 'undefined' || this.mask[this.cursor.y][this.cursor.x] === 'undefined') {
                    break;
                }


                if (this.data[this.cursor.y][this.cursor.x] === this.matrix.DATA_UNDEFINED_MODULE) {
                    bit = bits.shift();
                    this.writeBit(bit);

                    index += 1;
                    if (index >= limit) {
                        break;
                    }
                }

                tempy = this.cursor.y;
                this.cursor.x += offsets[offix][1][0];
                this.cursor.y += offsets[offix][1][1];
            }

            this.cursor.x += -2;
            this.cursor.y = tempy;
        }

    }
    catch(e) {
        this.cursor.x += -2;

        while (bits.length > 0) {

            if (index >= limit) {
                break;
            }

            offix = 1;

            while (bits.length > 0) {

                if (typeof this.mask[this.cursor.y] === 'undefined' || this.mask[this.cursor.y][this.cursor.x] === 'undefined') {
                    break;
                }

                if (this.data[this.cursor.y][this.cursor.x] === this.matrix.DATA_UNDEFINED_MODULE) {
                    bit = bits.shift();
                    this.writeBit(bit);

                    index += 1;
                    if (index >= limit) {
                        break;
                    }
                }

                tempy = this.cursor.y;
                this.cursor.x += offsets[offix][0][0];
                this.cursor.y += offsets[offix][0][1];

                if (typeof this.mask[this.cursor.y] === 'undefined' || this.mask[this.cursor.y][this.cursor.x] === 'undefined') {
                    break;
                }


                if (this.data[this.cursor.y][this.cursor.x] === this.matrix.DATA_UNDEFINED_MODULE) {
                    bit = bits.shift();
                    this.writeBit(bit);

                    index += 1;
                    if (index >= limit) {
                        break;
                    }
                }

                tempy = this.cursor.y;
                this.cursor.x += offsets[offix][1][0];
                this.cursor.y += offsets[offix][1][1];

                if (typeof this.mask[this.cursor.y] === 'undefined' || this.mask[this.cursor.y][this.cursor.x] === 'undefined') {
                    break;
                }


                if (this.data[this.cursor.y][this.cursor.x] === this.matrix.DATA_UNDEFINED_MODULE) {
                    bit = bits.shift();
                    this.writeBit(bit);

                    index += 1;
                    if (index >= limit) {
                        break;
                    }
                }

                tempy = this.cursor.y;
                this.cursor.x += offsets[offix][0][0];
                this.cursor.y += offsets[offix][0][1];

                if (typeof this.mask[this.cursor.y] === 'undefined' || this.mask[this.cursor.y][this.cursor.x] === 'undefined') {
                    break;
                }


                if (this.data[this.cursor.y][this.cursor.x] === this.matrix.DATA_UNDEFINED_MODULE) {
                    bit = bits.shift();
                    this.writeBit(bit);

                    index += 1;
                    if (index >= limit) {
                        break;
                    }
                }

                tempy = this.cursor.y;
                this.cursor.x += offsets[offix][1][0];
                this.cursor.y += offsets[offix][1][1];
            }

            if (index >= limit) {
                break;
            }

            this.cursor.x += -2;
            this.cursor.y = tempy;

            offix = 0;

            while (bits.length > 0) {

                if (typeof this.mask[this.cursor.y] === 'undefined' || this.mask[this.cursor.y][this.cursor.x] === 'undefined') {
                    break;
                }

                if (this.data[this.cursor.y][this.cursor.x] === this.matrix.DATA_UNDEFINED_MODULE) {
                    bit = bits.shift();
                    this.writeBit(bit);

                    index += 1;
                    if (index >= limit) {
                        break;
                    }
                }

                tempy = this.cursor.y;
                this.cursor.x += offsets[offix][0][0];
                this.cursor.y += offsets[offix][0][1];

                if (typeof this.mask[this.cursor.y] === 'undefined' || this.mask[this.cursor.y][this.cursor.x] === 'undefined') {
                    break;
                }


                if (this.data[this.cursor.y][this.cursor.x] === this.matrix.DATA_UNDEFINED_MODULE) {
                    bit = bits.shift();
                    this.writeBit(bit);

                    index += 1;
                    if (index >= limit) {
                        break;
                    }
                }

                tempy = this.cursor.y;
                this.cursor.x += offsets[offix][1][0];
                this.cursor.y += offsets[offix][1][1];

                if (typeof this.mask[this.cursor.y] === 'undefined' || this.mask[this.cursor.y][this.cursor.x] === 'undefined') {
                    break;
                }


                if (this.data[this.cursor.y][this.cursor.x] === this.matrix.DATA_UNDEFINED_MODULE) {
                    bit = bits.shift();
                    this.writeBit(bit);

                    index += 1;
                    if (index >= limit) {
                        break;
                    }
                }

                tempy = this.cursor.y;
                this.cursor.x += offsets[offix][0][0];
                this.cursor.y += offsets[offix][0][1];

                if (typeof this.mask[this.cursor.y] === 'undefined' || this.mask[this.cursor.y][this.cursor.x] === 'undefined') {
                    break;
                }


                if (this.data[this.cursor.y][this.cursor.x] === this.matrix.DATA_UNDEFINED_MODULE) {
                    bit = bits.shift();
                    this.writeBit(bit);

                    index += 1;
                    if (index >= limit) {
                        break;
                    }
                }

                tempy = this.cursor.y;
                this.cursor.x += offsets[offix][1][0];
                this.cursor.y += offsets[offix][1][1];
            }

            this.cursor.x += -2;
            this.cursor.y = tempy;
        }
    }
};
