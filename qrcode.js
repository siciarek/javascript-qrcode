var qrcodeDataProvider = [
    'The Beatles, White Album',
    'Lorem ipsum dolor sit amet.',
    'Apples & Oranges',
    'Hello, world!',
    'HELLO WORLD',
    '15071410',
    'A',
    '1',
    'a'
];

// WRITE:

var fs = require('fs');
var sys = require('sys');
var filename;
var modulesize = 2;

for (var i = 0; i < qrcodeDataProvider.length; i += 1) {

    var data = qrcodeDataProvider[i];

    var qrcode = require('./dist/nqrcode').QrCode(data);
    var code = qrcode.getData();
    var content = ['P1', code.length * modulesize + ' ' + code.length * modulesize];

    while (code.length > 0) {
        row = code.shift();

        row = row.map(function (e) {
            return new Array(modulesize + 1).join(e + ' ');
        });

        for (var s = 0; s < modulesize; s++) {
            content.push(row.join(''));
        }
    }

    filename = 'temp/generated/' + i + '.pbm';
    fs.writeFile(filename, content.join('\n'), function (err) {
        if (err) {
            throw err;
        }
    });
}

// READ:
var spawn = require('child_process').spawn;
var cmd = spawn('php', [ 'check.php', qrcodeDataProvider.length ]);
cmd.stdout.expected = qrcodeDataProvider;

cmd.stdout.on('data', function (data) {
    var expected = this.expected;
    var actual = JSON.parse(data.toString().trim());
    console.log(expected, actual);
});
