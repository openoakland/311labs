// This is the main application configuration file.  It is a Grunt
// configuration file, which you can learn more about here:
// http://gruntjs.com/getting-started
//
module.exports = function(grunt) {

  grunt.initConfig({

    // The clean task ensures all files are removed from the dist/ directory so
    // that no files linger from previous builds.
    clean: ["dist/"],

    // The jshint task will run the build configuration and the application
    // JavaScript through JSHint and report any errors.  You can change the
    // options for this task, by reading this:
    // https://github.com/gruntjs/grunt-contrib-jshint
    jshint: {
      options: {
        scripturl: true
      },
      files: [
        "build/config.js", "app/**/*.js"
      ]
    },

    // The jst task compiles all application templates into JavaScript
    // functions with the underscore.js template function from 1.2.4.  You can
    // change the namespace and the template options, by reading this:
    // https://github.com/tbranyen/build-tasks/tree/master/jst
    //
    // The concat task depends on this file to exist, so if you decide to
    // remove this, ensure concat is updated accordingly.
    jst: {
      "dist/debug/templates.js": ["app/templates/**/*.html"]
    },

    // The concatenate task is used here to merge the almond require/define
    // shim and the templates into the application code.  It's named
    // dist/debug/require.js, because we want to only load one script file in
    // index.html.
    concat: {
      "dist/debug/require.js": [
        "assets/js/libs/almond.js",
        "dist/debug/templates.js",
        "dist/debug/require.js"
      ]
    },

    // Copies files into release for static distribution
    copy: {
      prod: {
        src: ["app/**/*", "assets/**/*", "index.html"],
        dest: 'dist/release/'
      }
    },

    // Takes the built require.js file and minifies it for filesize benefits.
    uglify: {
      "dist/release/require.js": ["dist/debug/require.js"]
    },

    // Running the server without specifying an action will run the defaults,
    // port: 8080 and host: 127.0.0.1.  If you would like to change these
    // defaults, simply add in the properties `port` and `host` respectively.
    connect: {
      options: {
        port: process.env.PORT || 8000,
      },
      debug: {},
      release: {
        options: {
          base: 'dist/release/'
        }
      }
    },

    // This task uses James Burke's excellent r.js AMD build tool.  In the
    // future other builders may be contributed as drop-in alternatives.
    requirejs: {
      options: {
        // Include the main configuration file
        mainConfigFile: "app/config.js",

        // Output file
        out: "dist/debug/require.js",

        // Root application module
        name: "config",

        // Do not wrap everything in an IIFE
        wrap: false
      }
    },

    // The headless QUnit testing environment is provided for "free" by Grunt.
    // Simply point the configuration to your test directory.
    qunit: {
      all: ["test/qunit/*.html"]
    }

  });

  // Calls loadNpmTasks on all the grunt-* devDependencies
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // The default task will remove all contents inside the dist/ folder, lint
  // all your code, precompile all the underscore templates into
  // dist/debug/templates.js, compile all the application code into
  // dist/debug/require.js, and then concatenate the require/define shim
  // almond.js and dist/debug/templates.js into the require.js file.
  grunt.registerTask("default", ["clean", "jshint", "jst", "requirejs", "concat"]);

  // The debug task is simply an alias to default to remain consistent with
  // debug/release.
  grunt.registerTask("debug", ["default"]);

  // The release task will run the debug tasks and then minify the
  // dist/debug/require.js file and CSS files.
  grunt.registerTask("release", ["default", "uglify", "copy"]);

  // Call grunt server run default tasks and start up a server at http://localhost:8000
  grunt.registerTask("server", ["default", "connect:debug:keepalive"]);

};
