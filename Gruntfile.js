var async = require('async');
var inquirer = require('inquirer');

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-bump');

  grunt.initConfig({
    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        updateConfigs: [],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['-a'], // '-a' for all files
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
      }
    }
  });

  grunt.task.registerTask('update-files', function () {
    var done = this.async();

    async.series([
      function (next) {
        var editor = require('child_process').spawn('vim', ['CHANGELOG.md'], { stdio: 'inherit' });
        editor.on('exit', next);
      },

      function (next) {
        var editor = require('child_process').spawn('vim', ['UPGRADE-GUIDE.md'], { stdio: 'inherit' });
        editor.on('exit', next);
      }
    ], done);
  });

  grunt.task.registerTask('npm-publish', function () {
    var done = this.async();
    var npm = require('child_process').spawn('npm', ['publish'], { stdio: 'inherit' });
    npm.on('exit', done);
  });

  grunt.registerTask('release:patch', ['update-files', 'bump:patch', 'npm-publish']);
  grunt.registerTask('release:minor', ['update-files', 'bump:minor', 'npm-publish']);
  grunt.registerTask('release:major', ['update-files', 'bump:major', 'npm-publish']);

};
