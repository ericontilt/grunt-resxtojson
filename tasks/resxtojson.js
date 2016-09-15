/*
 * grunt-resxtojson
 * https://github.com/ericb81/grunt-resxtojson
 *
 * Copyright (c) 2014-2016 Eric Beragg
 * Licensed under the MIT license.
 */

 'use strict';

 var path = require('path');
 var xmldoc = require('xmldoc');

 function sprintf(format) {
  var i = 0, args = Array.prototype.slice.call(arguments, 1);
  return format.replace(/(%s)/g, function(){
    return args[i++];
  });
}

function keysIn(obj) {
  var key, keys = [];
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      keys.push(key);
    }
  }
  return keys;
}

function forEach(arr, callback) {
  var item, i;
  for (i = 0; i < arr.length; i++) {
    item = arr[i];
    callback(item, i);
  }
}

function _extend(keysFunc) {
  return function(target) {
    var keys, key, source;
    forEach(arguments, function(source) {
      keys = keysFunc(source);
      forEach(keys, function(key) {
        target[key] = source[key];
      });
    });
    return target;
  };
}

module.exports = function(grunt) {
  var Info = grunt.log.writeln,
  Warn = grunt.log.warn,
  Err = grunt.log.error,
  File = grunt.file,
  extend = _extend(keysIn);

  grunt.registerMultiTask('resxtojson', 'Convert resx files to JSON.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({});

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      var sourcePath,
      sourceFileName,
      fileContent,
      fileName, baseTranslation, outFilePath;

      // Create the destination directory, if it doesn't exist
      if (!File.isDir(f.dest)) {
        Info(sprintf('Destination directory created "%s"', f.dest));
        File.mkdir(f.dest);
      }

      sourcePath = f.src[0];

      if (!File.exists(sourcePath)) {
        throw new Error(sprintf('Source file "%s" not found.', f.src));
      }

      fileContent = File.read(sourcePath);
      baseTranslation = resxtojson(fileContent, options.matchPattern);
      sourceFileName = getFileNameFromPath(sourcePath);
      outFilePath = path.join(f.dest, sourceFileName.replace('.resx', '.js'));
      writeJSONOutput(outFilePath, JSON.stringify(baseTranslation));

      var sourceFiles = File.expand(
        [sourcePath.replace('.resx', '.*.resx')]);

      sourceFiles.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!File.exists(filepath)) {
          Warn(sprintf('Source file "%s" not found.', filepath));
          return false;
        } else {
          return true;
        }
      }).forEach(function(filePath) {
        var jsonFromResx;

        fileContent = File.read(filePath);
        try
        {
          jsonFromResx = extend({}, baseTranslation, resxtojson(fileContent, options.matchPattern));
        } catch (key) {
          throw new Error(sprintf('Error converting %s -> Value of %s cannot be parsed.', outFilePath, key));
        }

        fileName = getFileNameFromPath(filePath);
        outFilePath = path.join(f.dest, fileName.replace('.resx', '.js'));
        writeJSONOutput(outFilePath, JSON.stringify(jsonFromResx));
      });
    });
  });

  function getFileNameFromPath(path) {
    return path.substring(path.lastIndexOf('/'), path.length);
  }

  function writeJSONOutput(path, contents) {
    Info(sprintf('Created "%s"', path));
    File.write(path, contents);
  }

  function resxtojson(contents, matchPattern) {
    var xDoc, xDataChildren, xNode, outputObj;

    xDoc = new xmldoc.XmlDocument(contents);
    outputObj = {};

    xDoc.eachChild(function(node) {
      var currentKey, currentValue;
      if (node.name === 'data'){
        currentKey = node.attr.name;

        if (matchPattern) {
          if (!matchPattern.test(currentKey)) {
            return;
          }
        }

        try
        {
          currentValue = node.children[0].val;
          outputObj[currentKey] = currentValue;
        } catch (err) {
          throw currentKey;
        }
      }
    });

    return outputObj;
  }
};
