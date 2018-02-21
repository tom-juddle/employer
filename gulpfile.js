const browserSync = require('browser-sync').create();
const del = require('del');
const env = require('gulp-util').env;
const gulp = require('gulp');
const handlebars = require('gulp-compile-handlebars');
const helpers = require('handlebars-helpers');
const rename = require('gulp-rename');
const less = require('gulp-less'); 
const reload = browserSync.reload;
const concat = require('gulp-concat');

const config = {
  src: './src',
  dest: './dist',
  watchers: [
    {
      match: ['./src/**/*.hbs'],
      tasks: ['html']
    },
    {
      match: ['./src/css/*.less'],
      tasks: ['compile-less']
    },
    {
      match: ['./src/js/*.js'],
      tasks: ['scripts']
    },
    {
      match: ['./src/images/*','.src/images/**/*'],
      tasks: ['images']
    }
  ]
};

gulp.task('jquery', function() {
  return gulp.src('./src/js/jquery/*.js')
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('scripts', function() {
  return gulp.src('./src/js/*.js')
    .pipe(concat('library.js'))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('chat-scripts', function() {
  return gulp.src('./src/js/chats/*.js')
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('json-data', function() {
  return gulp.src('./src/js/data/*.js')
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('json', function() {
  return gulp.src('./src/json/*.json')
    .pipe(gulp.dest('./dist/json/'));
});

/*  compile less */
gulp.task('compile-less', function() {  
  gulp.src('./src/css/main.less')
    .pipe(less())
    .pipe(gulp.dest('./dist/css/'));
});

/* images */
gulp.task('images', function() {  
  gulp.src('./src/images/**/*')
    .pipe(gulp.dest('./dist/images/'));
});   

gulp.task('clean', () => del(config.dest));

gulp.task('html', ['clean'], () => {
  return gulp.src(`${config.src}/pages/*.hbs`)
    .pipe(handlebars({}, {
      ignorePartials: true,
      batch: [`${config.src}/partials`]
    }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest(config.dest));
});


gulp.task('serve', () => {
  browserSync.init({
    open: false,
    notify: false,
    files: [`${config.dest}/**/*`],
    server: config.dest
  });
});

gulp.task('watch', () => {
  config.watchers.forEach(item => {
    gulp.watch(item.match, item.tasks);
  });
});

gulp.task('default', ['clean'], function() {
    gulp.start(['html']);  
    gulp.start('serve');
    gulp.start('watch');
    gulp.start('compile-less');
    gulp.start('jquery');
    gulp.start('scripts');
    gulp.start('json-data');
    gulp.start('chat-scripts');
    gulp.start('images');
    gulp.start('json');
  });
