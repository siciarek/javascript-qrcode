// Sample Testacular configuration file, that contain pretty much all the available options
// It's used for running client tests on Travis (http://travis-ci.org/#!/karma-runner/karma)
// Most of the options can be overriden by cli arguments (see karma --help)
//
// For all available config options and default values, see:
// https://github.com/karma-runner/karma/blob/stable/lib/config.js#L54

module.exports = function (config) {
    var singleRun = true;

    config.set({

            frameworks: [
                'qunit'
            ],

// base path, that will be used to resolve files and exclude
            basePath: 'Resources/public/js',

// list of files / patterns to load in the browser
            files: [
//            // fixtures
//            { pattern: 'qunit/*.html', watched: true, served: true, included: false },
//
//            // files to test
//            { pattern: 'src/*.js', watched: true, served: true, included: true }

                // External dependencies:
                'http://cdnjs.cloudflare.com/ajax/libs/xregexp/2.0.0/xregexp-min.js',
                // Mocks:
                'qunit/mocks.js',

                // Scripts to test:
                'src/PluralizationRules.js',
                'src/Interval.js',
                'src/MessageSelector.js',
                'src/String.js',

                // Tests:
                'qunit/config.js',
                'qunit/data/trans.js',
                'qunit/tests/trans.js',
                'qunit/data/transchoice.js',
                'qunit/tests/transchoice.js'
            ],

// list of files to exclude
            exclude: [

            ],

            dataPath: '.',
// use dots reporter, as travis terminal does not support escaping sequences
// possible values: 'dots', 'progress', 'junit', 'teamcity'
// CLI --reporters progress

            reporters: ['progress', 'coverage'],
            preprocessors: {
                'src/*.js': ['coverage']
            },
//            junitReporter: {
//                // will be resolved to basePath (in the same way as files/exclude patterns)
//                outputFile: 'test-results.xml'
//            },

// web server port
// CLI --port 9876
            port: 9876,

// cli runner port
// CLI --runner-port 9100
            runnerPort: 9100,

// enable / disable colors in the output (reporters and logs)
// CLI --colors --no-colors
            colors: true,

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
// CLI --log-level debug
            logLevel: config.LOG_INFO,

// enable / disable watching file and executing tests whenever any file changes
// CLI --auto-watch --no-auto-watch
            autoWatch: !singleRun,
//
//// Start these browsers (plugins installation required), currently available:
//// - Chrome
//// - ChromeCanary
//// - Firefox
//// - Opera
//// - Safari (only Mac)
//// - PhantomJS
//// - IE (only Windows)
//// CLI --browsers Chrome,Firefox,Safari
            browsers: [
//                'ChromeCanary'
//                'Opera'
//                'IE'
//                'Chrome'
//                'Safari'
//                'Firefox'

                'IE',
                'Chrome',
                'Safari',
                'Firefox'
            ],


// If browser does not capture in given timeout [ms], kill it
// CLI --capture-timeout 5000
            captureTimeout: 5000,

// report which specs are slower than 500ms
// CLI --report-slower-than 500
            reportSlowerThan: 500,

// Auto run tests on start (when browsers are captured) and exit
// CLI --single-run --no-single-run
            singleRun: singleRun
        }
    )
};
