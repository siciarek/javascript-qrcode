javascript-qrcode
=================

[![Build Status](https://travis-ci.org/siciarek/javascript-qrcode.svg)](https://travis-ci.org/siciarek/javascript-qrcode)

Quick Response Code (QR-Code Model 2) generator in plain javascript.

Overview
--------

  * No dependecies
  * CLI script currently generates image in `svg` and `pbm` formats
  * numeric, alphanumeric and binary modes
  * data capacities compatible with ISO/IEC 18004
  * ready for web and CLI usage
  * supports UTF-8 up to 4 byte characters

Usage
-----

Webpage example:

```html
<script src="dist/qrcode.min.js"></script>

<script>
var data = 'ABC1234';

var qrcode = new QrCode(data);
var matrix = qrcode.getData();

/**
 *    matrix contains:
 *
 *    [
 *        [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
 *        [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1],
 *        [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
 *        [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1],
 *        [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
 *        [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1],
 *        [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
 *        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
 *        [1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
 *        [1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0],
 *        [1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0],
 *        [1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0],
 *        [0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
 *        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
 *        [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0],
 *        [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1],
 *        [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1],
 *        [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0],
 *        [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1],
 *        [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1],
 *        [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1]
 *    ]
 */

</script>
```

CLI example:
```bash

$ npm install javascript-qrcode
$ qrcode --help

 Usage: qrcode [options]

 Options:

   -h, --help                        output usage information
   -V, --version                     output the version number
   -d, --data [data]                 input data string
   -i, --input-file [file]           path to input data file.
   -o, --output-file [file]          path to output file.
   -e, --error-correction [L|M|Q|H]  error correction level.
   -m, --mask-pattern [pattern]      specific mask pattern, default auto.
   -n, --version-number [1-40]       QR Code version number.
   -s, --module-size [size]          single module size in pixels.
   -z, --quiet-zone-size [size]      quiet zone (border) size in modules.
   -f, --format [format]             image file format (svg, pbm).

$ qrcode --version
1.0.5

$ qrcode --data="ABC1234" --output-file="abcde" --format="svg"
$ zbarimg --quiet --raw abcde.svg
ABC1234

```
