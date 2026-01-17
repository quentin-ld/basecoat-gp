import { buildJS } from './esbuild.config.js';
import chalk from 'chalk';
import { formatTime, header, stepStart, stepSuccess, stepFailure, separator, failure, displayEsbuildError } from './terminal.js';

const main = async () => {
  const startTime = Date.now();
  header('Building JavaScript');
  stepStart(1, 1, 'Processing JavaScript files');
  
  try {
    await buildJS();
    const duration = Date.now() - startTime;
    stepSuccess(duration);
    
    console.log('');
    separator('=', chalk.cyan);
    console.log(chalk.green('JavaScript build completed'));
    separator('=', chalk.cyan);
    console.log(chalk.gray('  Note: JavaScript files are not compiled, only linted'));
    console.log(`  Total time: ${chalk.green(formatTime(duration))}`);
    separator('=', chalk.cyan);
    console.log('');
  } catch (error) {
    const duration = Date.now() - startTime;
    stepFailure(duration);
    failure('JavaScript build failed');
    displayEsbuildError(error);
    process.exit(1);
  }
};

main();
