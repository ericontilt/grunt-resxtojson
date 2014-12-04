/*
 * grunt-resxtojson
 * https://github.com/ericb81/grunt-resxtojson
 *
 * Copyright (c) 2014 Eric Beragg
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    resxtojson: {
      transform: {
        src: 'test/fixtures/Resources.resx',
        dest: 'tmp/transform/'
      },

      transformMatch: {
        src: 'test/fixtures/Resources.resx',
        dest: 'tmp/transformMatch/',
        options: {
          matchPattern: /\bPageTitle_.*\b/
        }
      }
    },

    watch: {
      tasks: {
        files: ['./tasks/resxtojson.js', './test/resxtojson_test.js'],
        tasks: ['default']
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'resxtojson', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};