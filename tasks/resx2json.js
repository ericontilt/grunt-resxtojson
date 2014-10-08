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

  grunt.registerMultiTask('resxtojson', 'Convert resx files to JSON.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({});

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Create the destination directory, if it doesn't exist
      if (!grunt.file.isDir(f.dest)) {
        grunt.log.writeln('Destination directory created "' + f.dest + '"');
        grunt.file.mkdir(f.dest);
      }

      f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).forEach(function(filepath) {
        var fileName, fileContent, jsonFromResx, outFilePath;
        
        fileName  = filepath.substring(filepath.lastIndexOf('/'), filepath.length);

        fileContent = grunt.file.read(filepath);
        jsonFromResx = JSON.stringify(resxtojson(fileContent));

        outFilePath = path.join(f.dest, fileName.replace('.resx', '.js'));
        grunt.log.writeln('Processed "' + filepath + '" -> "' + outFilePath + '"');
        grunt.file.write(outFilePath, jsonFromResx);
      });
    });
  });

  function resxtojson(contents) {
    var xDoc, xDataChildren, xNode, outputObj;

    xDoc = new xmldoc.XmlDocument(contents);
    outputObj = {};

    xDataChildren = xDoc.childrenNamed('data');

    for (xNode in xDataChildren) {
      outputObj[xDataChildren[xNode].attr.name] = xDataChildren[xNode].children[0].val;
    }

    return outputObj;
  }
};