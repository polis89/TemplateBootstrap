var gulp = require('gulp'); 
var clean = require('gulp-clean');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var styleInject = require("gulp-style-inject");
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('watch', ['browser_sync', 'compile_sass'], function() {
  gulp.watch('src/**/*.sass', ['compile_sass']);
  gulp.watch('src/*.html', browserSync.reload);
  gulp.watch('src/js/*.js', browserSync.reload);
});

gulp.task('browser_sync', function() {
  browserSync({
      server: {
          baseDir: 'src'
      },
      open: false,
      notify: false
  });
});

gulp.task('compile_sass', 
          ['compile_sass_main_dir'],
          function() {
  return gulp.src('src/sass/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['> 0.3%'],
            cascade: false
        }))
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('compile_sass_main_dir',
          function() {
  return gulp.src('src/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['> 0.3%'],
            cascade: false
        }))
        .pipe(gulp.dest('src'));
});

gulp.task('build', 
          [ 'copy_fonts',
            'copy_htaccess',
            'add_bootstrap_and_header_to_html',
            'minify_img'],function() {
  return gulp.src("dist/*.html")
        .pipe(gulp.dest("dist")); 
});

gulp.task('copy_fonts', ['copy_fonts_css'], function() {
  return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('copy_fonts_css', function() {
  return gulp.src('src/css/fonts.css')
        .pipe(gulp.dest('dist/css'));
});

gulp.task('copy_htaccess', function() {
  return gulp.src('src/.htaccess')
        .pipe(gulp.dest('dist'));
});

gulp.task('add_bootstrap_and_header_to_html', ['copy_index_useref'], function() {
  return gulp.src("dist/index.html")
        .pipe(styleInject())
        .pipe(gulp.dest("dist"));
});

gulp.task('copy_index_useref', ['compress_css'], function() {
  return gulp.src('src/index.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', cleanCSS({compatibility: 'ie8'})))
        .pipe(gulp.dest('dist'));
});

gulp.task('compress_css', function() {
  return gulp.src(["src/header.css", "src/libs/bootstrap/dist/css/bootstrap.min.css"])
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest("dist"));
});

gulp.task('minify_img', function() {
  return gulp.src('src/img/**/*')
        // .pipe(image())
        .pipe(gulp.dest('dist/img'));
});

gulp.task('clean', function() {
  return gulp.src('dist', {read: false})
        .pipe(clean());
});

gulp.task('copy_fontawesome_fonts', function() {
  return gulp.src('src/libs/font-awesome/fonts/*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('copy_slick_fonts', function() {
  return gulp.src('src/libs/slick-carousel/slick/**/*')
        .pipe(gulp.dest('dist/css'));
});