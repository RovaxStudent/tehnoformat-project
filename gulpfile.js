var gulp = require('gulp');
var bs = require('browser-sync');
var sass = require('gulp-sass');
var gutil = require( 'gulp-util' );
var concatCss = require('gulp-concat-css');
var ftp = require( 'vinyl-ftp' );
var autoprefixer = require('gulp-autoprefixer');

// Запускаем сервер, предварительно скомпилировав SASS
gulp.task('serve', ['sass'], function() {

    bs.init({
        server: "./src/assets/"
    });

    gulp.watch("src/assets/sass/*sass", ['sass']);
    gulp.watch("src/assets/sass/sections/*sass", ['sass']);
    gulp.watch("src/assets/sass/utils/*sass", ['sass']);
    gulp.watch("src/assets/*.html").on('change', bs.reload);
});

// Делаем компиляцию SASS в CSS
gulp.task('sass', function() {
    return gulp.src("src/assets/sass/*sass")
        .pipe(sass())                // Компилируем
        .pipe(autoprefixer({         // добавляем вендорные префиксы
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(concatCss("style.css")) // Склеиваем файлы
        .pipe(gulp.dest("src/assets/css/custom/"))
        .pipe(bs.stream());
});

// Выгружаем все файлы через FTP на хостинг
gulp.task( 'deploy', function () {
 
    var conn = ftp.create( {
        host:     '88.99.148.81',
        user:     'rovax104',
        password: 'vGdK85NPJw',
        log:      gutil.log
    } );
 
    // Откуда брать файлы
    var globs = [
        'src/**'
    ];
 
    // using base = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance
 
    return gulp.src( globs, { base: '.', buffer: false } )
        .pipe( conn.newer( '#' ) ) // only upload newer files
        .pipe( conn.dest( '#' ) );
 
} );

gulp.task('default', ['serve']);