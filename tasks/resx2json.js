/*
 * grunt-resxtojson
 * https://github.com/ericb81/grunt-resxtojson
 *
 * Copyright (c) 2014 Eric Beragg
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var xmldoc = require('xmldoc');

module.exports = function(grunt) {
  var Info = grunt.log.writeln,
      Warn = grunt.log.warn,
      File = grunt.file;

  grunt.registerMultiTask('resxtojson', 'Convert resx files to JSON.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({});

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Create the destination directory, if it doesn't exist
      if (!File.isDir(f.dest)) {
        Info('Destination directory created "' + f.dest + '"');
        File.mkdir(f.dest);
      }

      f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!File.exists(filepath)) {
          Warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).forEach(function(filepath) {
        var fileName, fileContent, jsonFromResx, outFilePath;
        
        fileName  = filepath.substring(filepath.lastIndexOf('/'), filepath.length);

        fileContent = File.read(filepath);
        jsonFromResx = JSON.stringify(resxtojson(fileContent, options.matchPattern));

        outFilePath = path.join(f.dest, fileName.replace('.resx', '.js'));
        if (options.verbose) {
          Info('Processed "' + filepath + '" -> "' + outFilePath + '"');
        }
        File.write(outFilePath, jsonFromResx);
      });
    });
  });

  function resxtojson(contents, matchPattern) {
    var xDoc, xDataChildren, xNode, outputObj, currentKey, currentValue;

    xDoc = new xmldoc.XmlDocument(contents);
    outputObj = {};

    xDataChildren = xDoc.childrenNamed('data');

    for (xNode in xDataChildren) {
      currentKey = xDataChildren[xNode].attr.name;
      currentValue = xDataChildren[xNode].children[0].val;

      if (matchPattern) {
        if (!matchPattern.test(currentKey)) {
          continue;
        }
      }

      outputObj[currentKey] = currentValue;
    }

    return outputObj;
  }
};