import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import nodeSass from 'node-sass';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import mqpacker from 'css-mqpacker';
import sortCSSmq from 'sort-css-media-queries';
import cssnano from 'cssnano';
import del from 'del';
import browserSync from 'browser-sync';
import util from 'gulp-util';
import plumber from 'gulp-plumber';
import pug from 'gulp-pug';

const sass = gulpSass(nodeSass);

const paths = {
  html: {
    src: ['src/pug/pages/*.pug', 'src/pug/*.pug'],
    dest: 'docs/',
  },
  pug: {
    src: 'src/pug/**/*.pug',
  },
  styles: {
    src: ['src/scss/**/*.*'],
    dest: 'docs/css/',
  },
  images: {
    src: ['src/images/**/*.*'],
    dest: 'docs/images/',
  },
  scripts: {
    src: ['src/js/**/*.*'],
    dest: 'docs/js/',
  },
  vendors: {
    src: 'src/vendors/**/*.*',
    dest: 'docs/vendors/',
  },
  fonts: {
    src: 'src/fonts/**/*.*',
    dest: 'docs/fonts/',
  },
};

export const clean = () => del(['docs/**/*', 'docs/*']);

export const server = () => {
  return browserSync.init({
    // injectChanges: true,
    server: {
      baseDir: './docs/',
    },
    open: false,
  });
};

export const html = () => {
  return gulp
    .src(paths.html.src)
    .pipe(
      plumber(function errorWatch(error) {
        util.log(error.message);
        this.emit('end');
      })
    )
    .pipe(pug({ pretty: true })) // compilation mode: false, true
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
};

const plugins = [
  autoprefixer({
    add: true,
    grid: true,
  }),
  mqpacker({
    sort: sortCSSmq,
  }),
  cssnano({
    zindex: false,
    reduceIdents: false,
  }),
];

export const styles = () => {
  return gulp
    .src(paths.styles.src)
    .pipe(
      plumber(function errorWatch(error) {
        util.log(error.message);
        this.emit('end');
      })
    )
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: 'expanded', // nested, expanded, compact, compressed
        precision: 5,
      })
    )
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
};

export const images = () => {
  return gulp
    .src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest))
    .pipe(browserSync.stream());
};

export const scripts = () => {
  return gulp
    .src(paths.scripts.src)
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
};

export const vendors = () => {
  return gulp
    .src(paths.vendors.src)
    .pipe(gulp.dest(paths.vendors.dest))
    .pipe(browserSync.stream());
};

export const fonts = () => {
  return gulp
    .src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
    .pipe(browserSync.stream());
};

export const watch = () => {
  gulp.watch(paths.pug.src, html);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.vendors.src, vendors);
  gulp.watch(paths.fonts.src, fonts);
};

const build = gulp.series(
  clean,
  gulp.parallel(html, styles, images, scripts, vendors, fonts)
);

const defaultTask = gulp.parallel(build, server, watch);

gulp.task('build', build);

gulp.task('default', defaultTask);

export default defaultTask;
