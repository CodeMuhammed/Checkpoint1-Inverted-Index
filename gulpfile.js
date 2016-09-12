/*
* This is a default gulp module that bundles browserify dependencies {}[]
*/
var gulp        = require('gulp');
var browserSync = require('browser-sync');
var exec = require('child_process').exec;

// This task runs the browser test runner and then serves the app.
gulp.task('app' , ['browsertestrunner' , 'serve']);

// This task serves the main application and watches the files in the folder for changes
gulp.task('serve', function () {
    var b2 = browserSync.create();
    b2.init({
        server: {
            baseDir: './public'
        },
        port: 3020,
        ui: {
            port: 3030
        }
    });

    gulp.watch('./public/**/*.{html,js,css}').on('change', b2.reload);
});

// This task loads teh development version of the test runner
// In the broswer during development and listens for changes made to the files
gulp.task('browsertestrunner', function() {

    var b1 = browserSync.create();
    b1.init({
      server: {
          baseDir: './',
          index : './tests/index.html',
          port: 3040,
          ui: {
              port: 3050
          }
      }
    });
    gulp.watch('./tests/unit/*.js').on('change', b1.reload);
    gulp.watch('./public/API/src/*.js').on('change', b1.reload);
});

// This task excecutes the karma-jasmine version of the test runner
// That will eventually get excecuted in travis CI environment
gulp.task('runkarma', function (callback) {
    exec('karma start tests/karma.conf.js', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        callback(err);
    });
});
