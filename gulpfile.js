const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const nodemon = require('gulp-nodemon');
const inject = require('gulp-inject-string');
const merge = require('merge-stream');
const gulpif = require('gulp-if');
const fs = require("fs");
const injectRegex = require('./gulp-modules/gulp-inject-string-regex/index');

var serverRunned = false;

gulp.task('serve', function(done) {
    if(!serverRunned)
        return nodemon({ script: 'server/main.js', watch: '.', ext: 'js', done: done })
            .on('start', function() {
                serverRunned = true;
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

gulp.task('html',function() {
    return gulp.src('site/*.html')
        .pipe(inject.before('<head>', '<!DOCTYPE html><html lang="en">'))
        .pipe(inject.after('<head>', '<script src="jquery-inject.js""></script>'))

        .pipe(inject.after('<head>', '<script src="/scripts/socket.io/client-dist/socket.io.js" defer></script>'))// socket io
        .pipe(inject.after('<head>', '<script src="https://unpkg.com/peerjs@1.4.7/dist/peerjs.min.js"></script>')) //peer
        .pipe(inject.after('<head>', '<script src="https://code.jquery.com/ui/1.13.2/jquery-ui.js"></script>')) //jquery
        .pipe(inject.after('<head>', '<script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>'))
        .pipe(inject.after('<head>', '<link rel="stylesheet" href="//code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css"></link>'))

        .pipe(inject.after('<head>', '<link rel="stylesheet" href="style.css">'))
        .pipe(inject.after('<head>', '<link rel="stylesheet" href="menu.css">'))
        .pipe(inject.after('<head>', '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no">'))
        .pipe(inject.after('<head>', '<meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0">'))
        .pipe(inject.before('</head>', '<script type="module" src="script.js" defer></script>'))
        .pipe(inject.before('</head>', '<script src="loader.js" defer></script>'))
        .pipe(inject.after('</body>', '</html>'))
        .pipe(injectRegex.after('<body>', {path : 'site/includes/', filename : "loader"}))

        .pipe(injectRegex.after(/\<.* data-inject-file="(.+)".*?>/, {path : 'site/includes/'}))
        .pipe(inject.after('<header>', fs.readFileSync('site/includes/header.html', 'utf-8')))
        .pipe(gulp.dest('./build'));
        //.pipe(browserSync.stream());
});

gulp.task('styles', function() {    
    var styles = gulp.src('site/styles/*.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest('./build'));
        // .pipe(browserSync.stream());;
    
    var specific = gulp.src('site/styles/specific/*.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest('./build'));

    var svg = gulp.src('site/svg/*.svg')
        .pipe(gulp.dest('build/svg'));

    return merge(styles, specific, svg);

});


gulp.task('scripts', function() {
    var script = gulp.src('site/scripts/*.js')
                     .pipe(gulp.dest('./build'));
                    //  .pipe(browserSync.stream());;

    var modules = gulp.src('site/scripts/modules/*.js')
                            //    .pipe(maps.init())
                            //    .pipe(concat('lib.js'))
                            //    .pipe(maps.write('./'))
                               .pipe(gulp.dest('./build'));

    return merge(script, modules);
})
gulp.task('watch', function() {
    gulp.watch('site/*.html', gulp.series('html'));
    gulp.watch('site/styles/*.scss', gulp.series('styles'));
    gulp.watch('site/svg/*.svg', gulp.series('styles'));
    gulp.watch('site/scripts/*.js', gulp.series('scripts'));
    gulp.watch('site/scripts/modules/*.js', gulp.series('scripts'));
});

gulp.task('default', gulp.series(
    gulp.parallel('html', 'styles', 'scripts'),
    // gulp.parallel('watch')
    gulp.parallel('watch', 'serve')
));
