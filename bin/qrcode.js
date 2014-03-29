#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var sys = require('sys');

function getPbm(code, modulesize) {

    var magicNumber = 'P1';
    var width = code.length * modulesize;
    var height = code.length * modulesize;

    var content = [
        magicNumber,
        '# QR Code Model 2',
        width + ' ' + height
    ];

    while (code.length > 0) {
        row = code.shift().map(function (e) {
            return new Array(modulesize + 1).join(e + ' ');
        });

        for (var s = 0; s < modulesize; s++) {
            content.push(row.join(''));
        }
    }

    return  content.join("\n");
}

program
    .version('0.0.1')
    .option('-d, --data [data]', 'input data string', 'QR Code Model 2')
    .option('-i, --input-file [file]', 'path to file containg input data.', null)
    .option('-o, --output-file [file]', 'path to output file.', null)
    .option('-e, --error-correction [L|M|Q|H]', 'error correction level.', 'L')
    .option('-n, --version-number [1-40]', 'QR Code version number.', null)
    .option('-s, --module-size [size]', 'single module size in pixels.', 2)
    .parse(process.argv);

var ecstrategy = [program.errorCorrection];
var data = program.data;

if (program.inputFile !== null) {
    data = fs.readFileSync(program.inputFile, 'utf8', function (err) {
        if (err) {
            throw err;
        }
    });
}

var qrcode = require('../tasks/qrcode').QrCode(data, ecstrategy, parseInt(program.versionNumber));
var info = qrcode.getInfo();

var content = getPbm(qrcode.getData(), parseInt(program.moduleSize));

if (program.outputFile === null) {
    console.log(content);
}
else {
    fs.writeFile(program.outputFile, content, function (err) {
        if (err) {
            throw err;
        }
    });
}
