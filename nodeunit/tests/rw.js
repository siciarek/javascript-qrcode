var dataSrc = 'basic.json';
var expect = {
    write: 11,
    read: 12
};
var timeout = 4000;

var mkdirp = require('mkdirp');
var fs = require('fs');


module.exports = {

    write: function (t) {

        t.expect(expect.write);

        var tmpdir = 'tmp';
        var dataFile = __dirname + '/../data/' + dataSrc;

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

                var i, test, spawn;
                spawn = require('child_process').spawn;

                for (i = 0; i < qrcodeDataProvider.length; i += 1) {
                    test = qrcodeDataProvider[i];
                    spawn('node', [
                        'bin/qrcode',
                        '-o', 'tmp/' + i,
                        '-d', test.data
                    ]);
                    t.ok(true, test.name);
                }
                t.done();
            }
        );
    },

    read: function (t) {

        t.expect(expect.read);

        var tmpdir = 'tmp';
        var dataFile = __dirname + '/../data/' + dataSrc;

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

                var i, test, exec = require('child_process').exec,
                    child;

                var output = [];

                for (i = 0; i < qrcodeDataProvider.length; i += 1) {
                    test = qrcodeDataProvider[i];

                    child = exec('zbarimg --quiet --raw ' + __dirname + '/../../tmp/' + i + '.svg',
                        function (error, stdout, stderr) {
                            var result = stdout.replace(/\n$/, '');
                            output.push(result);
                        }
                    );
                }

                setTimeout(function () {
                    t.deepEqual(output.length, qrcodeDataProvider.length, 'Size');

                    for (var p = 0; p < qrcodeDataProvider.length; p++) {
                        for (var o = 0; o < output.length; o++) {
                            var expected = qrcodeDataProvider[p].data;
                            var actual = output[o];
                            if (expected === actual) {
                                t.deepEqual(actual, expected, '' + p);
                            }
                        }
                    }

                    t.done()
                }, timeout);
            }
        );
    }
};
