const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');

let del;

// Импортируем del динамически
import('del').then((module) => {
    del = module.default;
});

// Задача для компиляции SASS и SCSS файлов
gulp.task('sass', function () {
    return gulp.src('src/sass/**/*.{sass,scss}')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.stream());
});

// Задача для удаления CSS файлов при удалении исходных SASS/SCSS файлов
gulp.task('watch-deleted', function () {
    if (!del) {
        console.error('del is not yet available');
        return;
    }

    return watch('src/sass/**/*.{sass,scss}', {events: ['unlink']}, function (vinyl) {
        const deletedFilePath = vinyl.path;
        const deletedFileBaseName = vinyl.basename.replace(/\.sass|\.scss/, '.css');
        del(`src/css/${deletedFileBaseName}`);
    });
});

// Задача для отслеживания изменений
gulp.task('watch', function () {
    // Инициализация BrowserSync
    browserSync.init({
        server: {
            baseDir: 'src'
        }
    });

    gulp.watch('src/sass/**/*.{sass,scss}', gulp.series('sass'));
    gulp.watch('src/*.html').on('change', browserSync.reload);
});

// Задача по умолчанию
gulp.task('default', gulp.parallel('sass', 'watch-deleted', 'watch'));