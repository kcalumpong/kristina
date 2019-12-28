// Modules
const   autoprefixer    = require('autoprefixer'),
        browser         = require('browser-sync').create(),
        concat          = require('gulp-concat'),
        cssnano         = require('cssnano'),
        del             = require('del'),
        gulp            = require('gulp'),
        imagemin        = require('gulp-imagemin'),
        nunjucks        = require('gulp-nunjucks-render'),
        postcss         = require('gulp-postcss'),
        rename          = require('gulp-rename'),
        sass            = require('gulp-sass'),
        uglify          = require('gulp-uglify');

// Paths
const   paths = {
        dest: 'dist',
        html: {
            src: 'src/pages/**/*.njk',
            njk: 'src/templates',
            watch: 'src/**/*.njk'
        },
        css: {
            src: 'src/assets/scss/**/*.scss',
            dest: 'dist/assets/css'
        },
        img: {
            src: 'src/assets/img/**/*{png,jpg,gif,svg,ico}',
            dest: 'dist/assets/img'
        },
        js: {
            jquery: 'node_modules/jquery/dist/jquery.slim.js',
            popper: 'node_modules/popper.js/dist/umd/popper.js',
            bootjs: 'node_modules/bootstrap/dist/js/bootstrap.js',
            colcade: 'node_modules/colcade/colcade.js',
            zoom: 'node_modules/zoom-vanilla.js/dist/zoom-vanilla.min.js',
            dest: 'dist/assets/js',
        }
};

// Clean
function clean(cb) {
    return del(paths.dest)
    cb();
}

// HTML
function html() {
    return gulp
        .src(paths.html.src)
        .pipe(nunjucks({
            path: [paths.html.njk]
        }))
        .pipe(gulp.dest(paths.dest))
        .pipe(browser.stream());
}

// CSS
function css() {
    const plugins = [
        autoprefixer(),
        cssnano()
    ];
    return gulp
        .src(paths.css.src)
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(postcss(plugins))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.css.dest))
        .pipe(browser.stream());
}

// JS
function js() {
    return gulp
        .src([
            paths.js.jquery,
            paths.js.popper,
            paths.js.bootjs,
            paths.js.colcade,
            paths.js.zoom
        ])
        .pipe(concat('theme.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.js.dest))
        .pipe(browser.stream());
}

// Images
function img() {
    return gulp
        .src(paths.img.src)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.img.dest))
        .pipe(browser.stream());
}

// Watch
function watch() {
    gulp.watch(paths.html.watch, html);
    gulp.watch(paths.css.src, css);
    gulp.watch(paths.img.src, img);
}

// Server
function server(cb) {
    browser.init({
        server: paths.dest
    })
    cb();
}

// Default tasks
exports.css = css;
exports.img = img;
exports.js = js;
exports.watch = gulp.parallel(watch, server);
exports.default = gulp.series(clean, html, gulp.parallel(css, js, img), gulp.parallel(watch, server));
