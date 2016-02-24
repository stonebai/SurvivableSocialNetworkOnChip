/**
 * Created by baishi on 2/24/16.
 */
module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mochaTest: {
            local: {
                options: {
                    reporter: 'spec',
                    quiet: false,
                    clearRequireCache: false,
                    ui: 'tdd'
                },
                src: ['test/**/*.js']
            },
            shippable: {
                options: {
                    reporter: 'mocha-junit-reporter',
                    reporterOptions: {
                        mochaFile: 'shippable/testresults/results.xml'
                    },
                    ui: 'tdd'
                },
                src: ['test/**/*.js']
            }
        },
        mocha_istanbul: {
            coverage: {
                src: 'test',
                options: {
                    mochaOptions: ['--ui', 'tdd']
                }
            }
        }
    });

    // Local dependencies
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-istanbul');

    grunt.registerTask('default', []);

    // Local test grunt
    grunt.registerTask('test', ['mochaTest:local']);

    // Shippable test grunt
    grunt.registerTask('shippable', ['mochaTest:shippable', 'mocha_istanbul']);

    // Coverage
    grunt.registerTask('coverage', ['mocha_istanbul']);

};