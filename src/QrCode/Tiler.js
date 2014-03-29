var Tiler = function (matrix) {
    'use strict';

    this.matrix = matrix;
};

Tiler.prototype.constructor = Tiler;

Tiler.prototype.setArea = function (datastr) {
    'use strict';

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

    var data = datastr.split('').parseInt();

    while (data.length > 0) {

        // Check if matrix bottom or top is reached:
        if (!(y >= 0 && y < this.matrix.getSize())) {

            x -= 2;
            y = tempy;

            // Switch move direction when code boundary is reached:
            direction = direction === UP ? DOWN : UP;

            // Left timing pattern exception:
            if (x === 6) {
                x -= 1;
            }
        }

        for (var i = 0; i < offsets[direction].length; i += 1) {

            // Place data bit only if matrix module is undefined:
            if (this.matrix.isModuleUndefined(x, y)) {
                this.matrix.setModule(x, y, data.shift(), this.matrix.MASK_DATA);
            }

            tempy = y;

            x += offsets[direction][i][0];
            y += offsets[direction][i][1];
        }
    }
};
