module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    jasmine_nodejs: {
      options: {
        specNameSuffix: '-spec.js',
      },

      dist: {
        specs:[
          "specs/**-spec.js"
        ]
      }
    },

    watch: {
      files: ["src/**/*.js", "specs/**/*.js", "*.js"],
      tasks: "test",
      options: {
        debounceDelay: 1000,
      }
    }
  });

  grunt.loadNpmTasks('grunt-jasmine-nodejs');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask("test", ["jasmine_nodejs"]);
};
