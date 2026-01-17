import chokidar from 'chokidar';
import { buildCSS } from './esbuild.config.js';
import chalk from 'chalk';
import { header, subSeparator, simpleStepStart, stepSuccess, stepFailure, separator, displayEsbuildError } from './terminal.js';

const buildWithDisplay = async (isInitial = false) => {
  const startTime = Date.now();
  const label = isInitial ? 'Initial build' : 'Rebuild';
  
  simpleStepStart(`[${label}] Compiling SCSS to CSS`);
  
  try {
    await buildCSS();
    const duration = Date.now() - startTime;
    stepSuccess(duration);
    return true;
  } catch (error) {
    const duration = Date.now() - startTime;
    stepFailure(duration);
    console.log('');
    separator('=', chalk.red);
    console.log(chalk.red(`CSS build failed: ${label}`));
    separator('=', chalk.red);
    console.log('');
    displayEsbuildError(error);
    separator('=', chalk.red);
    console.log('');
    return false;
  }
};

const main = () => {
  header('CSS Watch Mode');
  console.log(chalk.gray('Watching for changes in: assets/scss/**/*.scss'));
  console.log(chalk.gray('Press Ctrl+C to stop'));
  console.log('');
  subSeparator();
  console.log('');
  
  buildWithDisplay(true).then(() => {
    console.log('');
    subSeparator();
    console.log(chalk.green('Watching for changes...'));
    console.log('');
  });
  
  const watcher = chokidar.watch('assets/scss/**/*.scss', {
    ignored: /node_modules/,
    persistent: true,
    ignoreInitial: true
  });
  
  watcher.on('change', async (path) => {
    const relativePath = path.replace(`${process.cwd()}/`, '');
    console.log(chalk.yellow(`File changed: ${relativePath}`));
    await buildWithDisplay(false);
    console.log('');
  });
  
  watcher.on('error', (error) => {
    console.log('');
    separator('=', chalk.red);
    console.log(chalk.red('Watcher error'));
    separator('=', chalk.red);
    console.log('');
    console.log(chalk.gray(String(error)));
    console.log('');
    separator('=', chalk.red);
    console.log('');
  });
  
  process.on('SIGINT', () => {
    console.log('');
    subSeparator();
    console.log(chalk.yellow('Stopping watcher...'));
    watcher.close();
    console.log(chalk.green('Watcher stopped'));
    console.log('');
    process.exit(0);
  });
};

main();
