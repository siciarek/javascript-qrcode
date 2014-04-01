var dataSrc = 'basic.json';
var expect = {
    write: 11,
    read: 12
};
var timeout = 10000;

var mkdirp = require('mkdirp');
var fs = require('fs');
var prefix = Math.floor(Math.random() * 1000000);
var tmpdir = 'tmp/' + prefix;

var output = [];

module.exports = {

    write: function (t) {

        t.expect(expect.write);

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
                        '-o', tmpdir + '/' + i,
                        '-d', test.data
                    ]);

                    t.ok(true, test.name);
                }

                setTimeout(function () {
                    t.done();
                }, timeout);
            }
        );
    },

    read: function (t) {

        t.expect(expect.read);

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

                for (i = 0; i < qrcodeDataProvider.length; i += 1) {
                    test = qrcodeDataProvider[i];

                    var file = __dirname + '/../../' + tmpdir + '/' + i + '.svg';

                    child = exec('zbarimg --quiet --raw ' + file,
                        function (error, stdout, stderr) {
                            var result = stdout.replace(/\n$/, '');
                            output.push(result);
                        }
                    );
                }

                setTimeout(function () {
                    t.deepEqual(output.length, qrcodeDataProvider.length, 'Size');

                    for (var o = 0; o < output.length; o++) {
                        var actual = output[o];
                        for (var p = 0; p < qrcodeDataProvider.length; p++) {
                            var expected = qrcodeDataProvider[p].data;

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
