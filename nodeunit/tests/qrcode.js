var qrcodeDataProvider = [
    '1', 'A', 'a',
    'Apples & Oranges',
    '15071410',
    'http://www.google.com',
    'ABCDE123',
    'Hello, world!',
    'HELLO WORLD'
];

module.exports = {

    test: function (t) {

        var tmpdir = 'tmp';
        var mkdirp = require('mkdirp');
        var fs = require('fs');
        var sys = require('sys');
        var filename;
        var modulesize = 2;

        mkdirp(tmpdir, function(err) {
            if(err) {
                throw err;
            }
        });

// WRITE:

        for (var i = 0; i < qrcodeDataProvider.length; i += 1) {

            var data = qrcodeDataProvider[i];
            var code = require('../../dist/nqrcode').QrCode(data).getData();

            var magicNumber = 'P1';
            var width = code.length * modulesize;
            var height = code.length * modulesize;

            var content = [
                magicNumber,
                width,
                height
            ];

            while (code.length > 0) {
                row = code.shift().map(function (e) {
                    return new Array(modulesize + 1).join(e + ' ');
                });

                for (var s = 0; s < modulesize; s++) {
                    content.push(row.join(''));
                }
            }

            filename = tmpdir + '/' + i + '.pbm';

            fs.writeFile(filename, content.join('\n'), function (err) {
                if (err) {
                    throw err;
                }
            });
        }

// READ:

        var spawn = require('child_process').spawn;
        var cmd = spawn('php', [ 'nodeunit/check.php', tmpdir, qrcodeDataProvider.length ]);
        cmd.stdout.expected = qrcodeDataProvider;

        cmd.stdout.on('data', function (data) {
            var ret = JSON.parse(data.toString().trim());

            for(var i = 0; i < this.expected.length; i++) {
                var expected = this.expected[i];
                var actual = ret[i];
                t.deepEqual(actual, expected, ['exp: "', expected, '", act: "',actual, '"'].join(''));
            }

            t.done();
        });
    }
};
