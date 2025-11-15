import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

import * as dartSass from 'sass';
import archiver from 'archiver';
import autoprefixer from 'autoprefixer';
import cache from 'gulp-cache';
import combineMediaQuery from 'postcss-combine-media-query';
import cssDeclarationSorter from 'css-declaration-sorter';
import cssnano from 'cssnano';
import eslint from 'gulp-eslint';
import gulp from 'gulp';
import mergeRules from 'postcss-merge-rules';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import postcssScss from 'postcss-scss';
import prettier from 'gulp-prettier';
import sass from 'gulp-sass';
import sortMediaQueries from 'postcss-sort-media-queries';
import sourcemaps from 'gulp-sourcemaps';

const sassCompiler = sass(dartSass);

const scssPlugins = [
	cssDeclarationSorter({ order: 'alphabetical' })
];

const cssPlugins = [
	autoprefixer,
	combineMediaQuery,
	mergeRules,
	sortMediaQueries({ sort: 'mobile-first' }),
	cssnano()
];

/**
 * Lint JavaScript files and apply automatic fixes using ESLint and Prettier.
 */
gulp.task('lint-js', () => {
	return gulp.src('assets/js/**/*.js')
		.pipe(plumber())
		.pipe(eslint({
			env: {
				browser: true,
				commonjs: true,
				es6: true,
				node: true
			},
			globals: ['wp', 'wpdom'],
			extends: ['eslint:recommended', 'wordpress'],
			parserOptions: {
				sourceType: 'module',
				ecmaVersion: 2018,
			},
			rules: {
				indent: ['error', 'tab'],
				semi: ['error', 'always'],
				quotes: ['error', 'single'],
				'linebreak-style': ['error', 'unix']
			},
			fix: true,
		}))
		.pipe(eslint.format())
		.pipe(eslint.failAfterError())
		.pipe(prettier(
			{
				singleQuote: true,
				trailingComma: 'all',
				printWidth: 120,
				endOfLine: 'lf',
				insertFinalNewline: true,
				trimTrailingWhitespace: true,
				semi: true
			}))
		.pipe(plumber.stop())
		.pipe(gulp.dest('assets/js'));
});

/**
 * Lint SCSS files and format them using Prettier.
 */
gulp.task('lint-scss', () => {
	return gulp.src('assets/scss/**/*.scss')
		.pipe(plumber())
		.pipe(postcss(scssPlugins, { syntax: postcssScss }))
		.pipe(prettier(
			{
				singleQuote: true,
				trailingComma: 'all',
				printWidth: 120,
				endOfLine: 'lf',
				insertFinalNewline: true,
				trimTrailingWhitespace: true,
				semi: true
			}))
		.pipe(plumber.stop())
		.pipe(gulp.dest('assets/scss'));
});

/**
 * Lint PHP files using the Composer PHP linting tool.
 */
gulp.task('lint-php', (done) => {
	exec('composer lint:php', (err, stdout, stderr) => {
		if (err) {
			console.error(`Error: ${stderr}`);
			done(err);
			return;
		}
		console.log(stdout);
		done();
	});
});

/**
 * Compile SCSS files into CSS with sourcemaps and cache the result.
 */
gulp.task('build-css', () => {
	return gulp.src('assets/scss/theme.scss')
		.pipe(plumber())
		.pipe(cache(sourcemaps.init()))
		.pipe(sassCompiler().on('error', sassCompiler.logError))
		.pipe(postcss(cssPlugins))
		.pipe(sourcemaps.write('.'))
		.pipe(plumber.stop())
		.pipe(gulp.dest('assets/css'));
});

/**
 * Watch for changes in SCSS files and trigger the 'build-css' task.
 */
gulp.task('watch-scss', () => {
	gulp.watch('assets/scss/**/*.scss', gulp.series('build-css'));
});

/**
 * Create a zip archive of the theme excluding specified files and directories.
 */
gulp.task('zip-theme', (done) => {
	const currentDir = path.basename(process.cwd());
	const zipFileName = `${currentDir}.zip`;
	const output = fs.createWriteStream(path.join('.', zipFileName));
	const archive = archiver('zip', {
		zlib: { level: 9 }
	});

	output.on('close', () => {
		console.log(`Zipped ${archive.pointer()} total bytes`);
		done();
	});

	archive.on('error', (err) => {
		throw err;
	});

	archive.pipe(output);

	archive.glob('**/*', {
		ignore: [
			'.DS_Store',
			'.editorconfig',
			'.eslintignore',
			'.eslintrc*',
			'.git/**',
			'.gitignore',
			'.gitattributes',
			'.php-cs-fixer.php',
			'.sublime/**',
			'.vscode/**',
			'composer.json',
			'composer.lock',
			'conf/**/*',
			'generatepress-settings-*.json',
			'gulpfile.js',
			'node_modules/**',
			'package-lock.json',
			'package.json',
			'phpstan.neon',
			'vendor/**',
			'*.tar.gz',
			'*.zip'
		]
	});

	archive.finalize();
});

/**
 * Watch for changes in SCSS files.
 */
gulp.task('watch', gulp.series('watch-scss'));

/**
 * Build task to run all linters, build CSS, and log 'done' if no errors.
 */
gulp.task('build', gulp.series(
	'lint-scss',
	'build-css',
	'lint-js',
	'lint-php'
));

/**
 * Default task to start watching SCSS and PHP files.
 */
gulp.task('default', gulp.series('build'));
