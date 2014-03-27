var Tiler = function (matrix) {
    'use strict';

    this.matrix = matrix;
};

Tiler.prototype.constructor = Tiler;

Tiler.prototype.setArea = function (datastr) {
    'use strict';

    var data = datastr.split('').parseInt();

    var UP = 0;
    var DOWN = 1;

    var direction = UP;

    var offsets = {};
    offsets[UP] = [
        [-1, 0],
        [1, -1]
    ];
    offsets[DOWN] = [
        [-1, 0],
        [1, 1]
    ];

    // Start at the last module:
    var x = this.matrix.getSize() - 1;
    var y = this.matrix.getSize() - 1;
    var tempy = y;

    while (data.length > 0) {

        // Check if matrix bottom or top is reached:
        if (!(y >= 0 && y < this.matrix.getSize())) {
            x -= 2;
            y = tempy;

            direction += 1;
            direction %= 2;
        }

        for (var i = 0; i < offsets[direction].length; i += 1) {

            // Place data bit only module is undefined:
            if (this.matrix.data[y][x] === this.matrix.DATA_UNDEFINED_MODULE) {

                var bit = data.shift();

                if (bit === 1) {
                    this.matrix.setDarkModule(x, y, this.matrix.MASK_DATA);
                }
                else {
                    this.matrix.setLightModule(x, y, this.matrix.MASK_DATA);
                }

                // Check if { x: 7, y: 9 } module is reached:
                if (x === 7 && y === 9) {
                    x -= 2;
                    direction = DOWN;
                    break;
                }
            }

            tempy = y;

            x += offsets[direction][i][0];
            y += offsets[direction][i][1];
        }
    }
};
