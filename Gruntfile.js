module.exports = function(grunt) {
  grunt.initConfig({
    clean: ['dist/'],
    ejs: {
      all: {
        options: {
          bodyid: function(filename) {
            return require('path').basename(filename, '.ejs')
          },
        },
        src: ['**/*.ejs', '!partials/**/*'],
        dest: 'dist/',
        cwd: 'app/',
        expand: true,
        ext: '.html',
      },
    },
    copy: {
      all: {
        src: ['assets/**/*'],
        dest: 'dist/',
      },
    },
    browserify: {
      options: { alias: 'jquery2:jquery', },
      all: {
        src: 'app/index.js',
        dest: 'dist/assets/js/index.js'
      },
    },
    connect: {
      options: {
        port: process.env.PORT || 8000,
        base: 'dist/',
      },
      all: {},
    },
    watch: {
      html: {
        files: '<%= ejs.all.src %>',
        tasks: ['ejs'],
      },
      js: {
        files: '<%= browserify.all.src %>',
        tasks: ['browserify'],
      },
      assets: {
        files: 'assets/**/*',
        tasks: ['copy'],
      }
    }
  })
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)
  grunt.registerTask('default', ['clean', 'ejs', 'browserify', 'copy'])
  grunt.registerTask('dev', ['default', 'connect', 'watch'])
};
