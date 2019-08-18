const
  gulp         = require('gulp'),
  sass         = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cleanCSS     = require('gulp-clean-css'),
  rename       = require('gulp-rename'),
  browserSync  = require('browser-sync').create(),
  concat       = require('gulp-concat'),
  inject       = require('gulp-inject'),
  uglify       = require('gulp-uglify'),
  svgSprite    = require('gulp-svg-sprites'),
  svgmin       = require('gulp-svgmin');

gulp.task('browser-sync', ['styles', 'scripts', 'common', 'svgSpriteBuild'], function() {
  browserSync.init({
    server: {
      baseDir: "./app"
    },
    notify: false
  });
});

gulp.task('svgSpriteBuild', function () {
  return gulp.src('svg/*.svg')
    .pipe(svgmin({
      js2svg: {
        pretty: true
      }
    }))
    .pipe(svgSprite({
        mode: "symbols",
        preview: false,
        selector: "marinet_%f",
        svg: {
          symbols: 'sprite.svg'
        }
      }
    ))
    .pipe(gulp.dest('./app/img/svg/'));
});

gulp.task('styles', function () {
  return gulp.src('sass/*.sass')
    .pipe(sass({
      includePaths: require('node-bourbon').includePaths
    }).on('error', sass.logError))
    .pipe(rename({suffix: '.min', prefix : ''}))
    .pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
    .pipe(cleanCSS())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream());
});


gulp.task('scripts', function() {
  return gulp.src([
    './app/libs/jquery/jquery-3.3.1.min.js',
    './app/libs/jquery/jquery.easy-autocomplete.min.js',
    './app/js/datepicker.min.js',
    './app/js/datepicker.en.js',
    './app/js/mixitup.min.js'
  ])
    .pipe(concat('libs.js'))
    // .pipe(uglify()) //Minify libs.js
    .pipe(gulp.dest('./app/js/'));
});

gulp.task('common', function() {
  return gulp.src([
    './app/js/common.js'
  ])
    .pipe(concat('common.min.js'))
    .pipe(uglify()) // Minify common.js
    .pipe(gulp.dest('./app/js/'));
});

gulp.task('watch', function () {
  gulp.watch('sass/*.sass', ['styles']);
  gulp.watch('app/libs/**/*.js', ['scripts']);
  gulp.watch('app/js/common.js', ['common']);
  gulp.watch('app/js/*.js').on("change", browserSync.reload);
  gulp.watch('app/*.html').on('change', browserSync.reload);
});

gulp.task('default', ['browser-sync', 'watch']);
