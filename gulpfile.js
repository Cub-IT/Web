const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const nodemon = require('gulp-nodemon');
const gulpCssbeautify = require('gulp-cssbeautify');
// const browserSync = require('browser-sync').create();
const inject = require('gulp-inject-string');
const concat = require('gulp-concat');
const merge = require('merge-stream');
const maps = require('gulp-sourcemaps');

gulp.task('serve', function(done) {
    return nodemon({ script: 'main.js', watch: '.', ext: 'js', done: done })
        .on('start', function() {
            // if (!browserSync.active) {
            //     console.log('Starting browser-sync server...');
            //     browserSync.init({ proxy: 'localhost:9090', startPath: '/authorization.html' });
            // }
        })
        .on('restart', function() {
            console.log('Server restarted.');
        })
        .on('crash', function() {
            console.error('Server crashed!');
            this.emit('restart', 10)
        });
});

gulp.task('pug',function() {
    return gulp.src('site/dev/pages/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(inject.after('<head>', '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no">'))
        .pipe(inject.before('</head>', '<script src="js/general.js"></script>'))
        .pipe(inject.before('</body>', '<script src="js/menu.js"></script>'))
        .pipe(gulp.dest('./build'));
        //.pipe(browserSync.stream());
});

gulp.task('styles', function() {
    return gulp.src('site/dev/style/*.scss')
        .pipe(sass())
        .pipe(gulpCssbeautify())
        .pipe(gulp.dest('build/css'));
        // .pipe(browserSync.stream());;
});

gulp.task('bootstrap-style', function(){
    return gulp.src('site/dev/style/bootstrap/*.scss')
        .pipe(sass())
        .pipe(gulpCssbeautify())
        .pipe(gulp.dest('build/css/main'));
});

gulp.task('scripts', function() {
    var script = gulp.src('site/dev/js/*.js')
                     .pipe(gulp.dest('build/js'));
                    //  .pipe(browserSync.stream());;

    var bootstrap_script = gulp.src('node_modules/bootstrap/dist/js/bootstrap.bundle.js')
                               .pipe(maps.init())
                               .pipe(concat('lib.js'))
                               .pipe(maps.write('./'))
                               .pipe(gulp.dest('build/js'));

    return merge(script, bootstrap_script);
})
gulp.task('watch', function() {
    gulp.watch('site/dev/**/*.pug', gulp.series('pug'));
    gulp.watch('site/dev/**/*.scss', gulp.series('styles'));
    gulp.watch('site/dev/**/*.js', gulp.series('scripts'));
});

gulp.task('default', gulp.series(
    gulp.parallel('pug', 'styles', 'bootstrap-style', 'scripts'),
    gulp.parallel('watch', 'serve')
));
