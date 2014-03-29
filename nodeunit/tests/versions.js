module.exports = {

    test: function (t) {

        var maxver = 40;
        var eclevels = ['L', 'M', 'Q', 'H'];
        var chars = ['1', 'A', 'x'];

        var totalCount = maxver * eclevels.length * chars.length;

        var spawn = require('child_process').spawn;
        var cmd = spawn('php', [ 'nodeunit/onechar.php', maxver ]);
        cmd.stdout.totalCount = totalCount;

        cmd.stdout.on('data', function (data) {
            var response = data.toString().trim();
            var rx = new RegExp('^\.{' + this.totalCount + '}$')
            t.ok(rx.test(response), 'content (' + response.length + ') ok');
            t.done();
        });
    }
};
