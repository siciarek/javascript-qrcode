module.exports = function (grunt) {
    'use strict';

    var pkg = grunt.file.readJSON('package.json');
    var nutap_cmd = 'node ./node_modules/grunt-contrib-nodeunit/node_modules/nodeunit/bin/nodeunit --reporter tap';
    var nutap_opts = {
        stdout: true,
        stderr: true,
        failOnError: true,
        warnOnError: true
    };

    // Project configuration.
    grunt.initConfig({
            pkg: pkg,
            // Before generating new test files, remove any previously-created files.
            clean: {
                tests: ['tmp'],
                tidy: ['*.svg', '*.png', '*.pdf', 'temp.*']
            },
            concat: {
                dest: {
                    src: [
                        'src/Utils.js',
                        'src/QrCode/*.js'
                    ],
                    dest: 'dist/qrcode.js'
                },
                ndest: {
                    src: [
                        'src/Utils.js',
                        'src/QrCode/*.js',
                        'src/module.exports.js'
                    ],
                    dest: 'lib/qrcode.js'
                }
            },
            uglify: {
                options: {
                    banner: '/*! <%= pkg.name %>: <%= pkg.description %> <%= grunt.template.today("yyyy-mm-dd hh:MM") %> */\n'
                },
                build: {
                    src: 'dist/qrcode.js',
                    dest: 'dist/qrcode.min.js'
                }
            },
            compare_size: {
                files: [
                    'dist/qrcode.js',
                    'dist/qrcode.min.js',
                    'lib/qrcode.js'
                ]
            },
            jshint: {
                options: {
                    jshintrc: '.jshintrc'
                },
                files: [
                    'Gruntfile.js',
                    'src/QrCode/*.js',
                    'src/*.js',
                    'bin/*',
                    '!dist/*.min.js'
                ]
            },
            qunit: {
                tests: [
                    "qunit/index.src.html",
                    "qunit/index.html",
                    "qunit/index.min.html"
                ]
            },
            nodeunit: {
                lang: {
                    src: [
                        'nodeunit/tests/lang.js'
                    ]
                },
                basic: {
                    src: [
                        'nodeunit/tests/basic.js'
                    ]
                },
                sizes: {
                    src: [
                        'nodeunit/tests/sizes.js'
                    ]
                },
                myway: {
                    src: [
                        'nodeunit/tests/myway.js'
                    ]
                },
                max: {
                    src: [
                        'nodeunit/tests/max.js'
                    ]
                },
                versions: {
                    src: [
                        'nodeunit/tests/versions.js'
                    ]
                }
            },
            shell: {
                nutap_lang: {
                    command: nutap_cmd + ' ./nodeunit/tests/lang.js',
                    options: nutap_opts
                },
                nutap_basic: {
                    command: nutap_cmd + ' ./nodeunit/tests/basic.js',
                    options: nutap_opts
                },
                nutap_sizes: {
                    command: nutap_cmd + ' ./nodeunit/tests/sizes.js',
                    options: nutap_opts
                },
                nutap_myway: {
                    command: nutap_cmd + ' ./nodeunit/tests/myway.js',
                    options: nutap_opts
                },
                nutap_max: {
                    command: nutap_cmd + ' ./nodeunit/tests/max.js',
                    options: nutap_opts
                },
                nutap_ver: {
                    command: nutap_cmd + ' ./nodeunit/tests/versions.js',
                    options: nutap_opts
                }
            },
            karma: {
                unit: {
                    configFile: 'karma.conf.js'
                }
            },
            watch: {
                scripts: {
                    files: ['**/*.js'],
                    tasks: ['jshint'],
                    options: {
                        spawn: false
                    }
                }
            },
            jsdoc: {
                dist: {
                    src: ['src/*.js', 'README.md'],
                    dest: 'doc'
                }
            }
        }
    )
    ;

// Load grunt plugins.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-compare-size');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-shell');

// Build task.
    grunt.registerTask('build', [ 'concat', 'uglify', 'compare_size' ]);

// Test tasks.
    grunt.registerTask('nunit', [ 'build', 'clean', 'nodeunit' ]);
    grunt.registerTask('test', [ 'jshint', 'qunit' ]);
    grunt.registerTask('ver', [ 'clean', 'shell:nutap_ver' ]);

// Default task.
    grunt.registerTask('default', [ 'build', 'test' ]);

// All the tasks.
    grunt.registerTask('all', [ 'default', 'nunit' ]);

};