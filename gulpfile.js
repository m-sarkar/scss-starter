var gulp = require('gulp');
var gulpif = require('gulp-if');
var flatten = require('gulp-flatten');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
// var sourcemaps = require('gulp-sourcemaps');
// var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var changed = require('gulp-changed');
// var concat = require('gulp-concat');
var cssNano = require('gulp-cssnano');
var development = true; // CHANGE TO FALSE FOR PRODUCTION
var devUrl = 'http://localhost/scss-starter'; // CHANGE THE URL HERE
var distPath = './assets/';
var buildPath = './build/';
var path = {
    dist: {
        fonts: './fonts/',
        images: './img/',
        styles: './css/',
        scripts: './js/'
    },
    build: {
        fonts: './build/fonts/',
        images: './build/img/',
        styles: './build/css/',
        scripts: './build/js/'
    }

};
//fonts, images, styles, scripts
gulp.task('styles', function() {
    return gulp.src([
            './build/css/plugins/*.css',
            './build/css/global.scss',
            './build/css/structure.scss',
            './build/css/main.scss'
        ])
        // .pipe(gulpif(development, sourcemaps.init()))
        .pipe(sass({
            outputStyle: 'nested', // libsass doesn't support expanded yet
            precision: 10,
            includePaths: ['.']
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: [
                'last 5 versions',
                'android 4',
                'opera 12',
                'IE 7',
                'Firefox >= 20'
            ]
        }))
        // .pipe(concat('main.min.css'))

    .pipe(gulpif(!development, cssNano({
        discardComments: { removeAll: true },
        safe: true
    })))

    // .pipe(gulpif(development, sourcemaps.write('.')))
    .pipe(gulp.dest(path.dist.styles))
        .pipe(browserSync.stream());
});

// Process scripts from build script's plugin folder
gulp.task('plugin-scripts', function() {
    return gulp.src([
            './build/js/jquery/jquery.js',
            './build/js/jquery/jquery-migrate.js',
            './build/js/jquery/Moment.js',
            './build/js/plugins/*.js'
        ])
        // .pipe(gulpif(development, sourcemaps.init()))
        // .pipe(concat('plugins.min.js'))
        // .pipe(uglify({
        //     compress: {
        //         'drop_debugger': true,
        //         'drop_console': true,
        //         'unused': true
        //     }
        // }))
        // .pipe(gulpif(development, sourcemaps.write('.')))
        .pipe(gulp.dest(path.dist.scripts))
        .pipe(browserSync.stream());
});

// Process custom script file
gulp.task('custom-scripts', function() {
    return gulp.src([
            './build/js/scripts.js'
        ])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        // .pipe(gulpif(development, sourcemaps.init()))
        // .pipe(concat('scripts.min.js'))
        /*comment to disable minify of custom scripts*/
        // .pipe(uglify({
        //     compress: {
        //         'drop_debugger': true,
        //         'drop_console': false,
        //         'unused': true
        //     }
        // }))
        // .pipe(gulpif(development, sourcemaps.write('.')))
        .pipe(gulp.dest(path.dist.scripts))
        .pipe(browserSync.stream());
});

gulp.task('scripts', function(callback) {
    runSequence('plugin-scripts', 'custom-scripts', callback);
});
gulp.task('fonts', function() {
    return gulp.src(['./build/fonts/**'])
        .pipe(flatten())
        .pipe(gulp.dest(path.dist.fonts))
        .pipe(browserSync.stream());
});
// gulp.task('media', function() {
//     return gulp.src(['./build/media/**'])
//         .pipe(flatten())
//         .pipe(gulp.dest(path.dist.media))
//         .pipe(browserSync.stream());
// });

// gulp.task('flags', function() {
//     return gulp.src(['./build/flags/**'])
//         .pipe(gulp.dest(path.dist.flags))
//         .pipe(browserSync.stream());
// });

gulp.task('images', function() {
    return gulp.src(['./build/img/**'])
        .pipe(imagemin({
            progressive: true,
            interlaced: true,
            svgoPlugins: [{ removeUnknownsAndDefaults: false }, { cleanupIDs: false }]
        }))
        .pipe(gulp.dest(path.dist.images))
        .pipe(browserSync.stream());
});
gulp.task('watch', function() {
    gulp.watch(['./build/css/**/**'], ['styles']);
    gulp.watch(['./build/js/plugins/**/**'], ['plugin-scripts']);
    gulp.watch(['./build/js/scripts.js'], ['custom-scripts']);
    gulp.watch(['./build/js/main.js'], ['main-scripts']);
    gulp.watch(['./build/fonts/**/*'], ['fonts']);
    gulp.watch('./build/img/**/*', ['images']);
});

gulp.task('watch_live', function() {
    browserSync.init({
        files: ['**/*.php', '*.php', '*.html'],
        proxy: devUrl,
        notify: false
    });
    gulp.watch('./build/css/**/**', ['styles']);
    gulp.watch('./build/js/plugins/**/**', ['plugin-scripts']);
    gulp.watch('./build/js/scripts.js', ['custom-scripts']);
    gulp.watch('./build/js/main.js', ['main-scripts']);
    gulp.watch('./build/fonts/**/**', ['fonts']);
    gulp.watch('./build/img/**/**', ['images']);

});


//Build process
gulp.task('build', function(callback) {
    runSequence('styles',
        'scripts', ['fonts', 'images'],
        callback);
});

// Deletes the build folder completely
gulp.task('clean', require('del').bind(null, [distPath]));


gulp.task('default', ['clean'], function() {
    gulp.start('build');
});