# grunt-resxtojson

> Convert resx files to JSON files.

## Getting Started
This plugin requires Grunt `>=0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-resxtojson --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-resxtojson');
```

## The "resxtojson" task

### Overview
In your project's Gruntfile, add a section named `resxtojson` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  resxtojson: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Usage Examples

```js
grunt.initConfig({
  resxtojson: {
    transform: {
      src: 'test/fixtures/Resources.resx',
      dest: 'tmp/',
      options: {
        matchPattern: /\bPageTitle_.*\b/
      }
    }
  },
});
```

src

Please note that the source file should point to the main resx file. This language resources from this file will be used as a fallback, when a specific translation does not exist.

matchPattern

A regular expression which is used to match against resource keys.

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

0.4.3 - Merged pull request regarding grunt peer dependency
0.3.2 - Fixed occasional XML parse error
0.3.1 - Update documentation
0.3.0 - Released first version
