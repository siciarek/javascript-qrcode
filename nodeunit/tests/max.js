module.exports = {

    test: function (t) {

        var tmpdir = 'tmp';
        var dataFile = __dirname + '/../data/max.json';
        var modulesize = 2; // size (px) of data module on the code picture

        var mkdirp = require('mkdirp');
        var fs = require('fs');
        var sys = require('sys');

        mkdirp(tmpdir, function (err) {
            if (err) {
                throw err;
            }
        });

        fs.readFile(dataFile, 'utf8', function (err, data) {

            if (err) {
                console.log('Error: ' + err);
                return;
            }

            var qrcodeDataProvider = JSON.parse(data);

// WRITE:

            for (var i = 0; i < qrcodeDataProvider.length; i += 1) {

                var eclevel = qrcodeDataProvider[i].eclevel;

                var qrcode = require('../../lib/qrcode').QrCode(qrcodeDataProvider[i].data, [eclevel]);
                var info = qrcode.getInfo();
                delete info.data;

                t.ok(true, JSON.stringify(info));


                var code = qrcode.getData();

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

                var filename = tmpdir + '/' + i + '.pbm';

                fs.writeFile(filename, content.join('\n'), function (err) {
                    if (err) {
                        throw err;
                    }
                });
            }

// READ:

            var spawn = require('child_process').spawn;
            var cmd = spawn('php', [ 'nodeunit/decode.php', tmpdir, qrcodeDataProvider.length, modulesize ]);
            cmd.stdout.expected = qrcodeDataProvider;

            cmd.stdout.on('data', function (data) {
                var ret = JSON.parse(data.toString().trim());

                for (var i = 0; i < this.expected.length; i++) {
                    var expected = this.expected[i];
                    var actual = ret[i];
                    t.deepEqual(actual.data, expected.data, 'file: "' + tmpdir + '/' + i + '.pbm');
                }

                t.done();
            });
        });
    }
};
