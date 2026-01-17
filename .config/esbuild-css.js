import { buildCSS } from './esbuild.config.js';
import { header, stepStart, stepSuccess, stepFailure, success, failure, displayEsbuildError } from './terminal.js';

const main = async () => {
  const startTime = Date.now();
  header('Building CSS');
  stepStart(1, 1, 'Compiling SCSS to CSS');
  
  try {
    await buildCSS();
    const duration = Date.now() - startTime;
    stepSuccess(duration);
    success('CSS build completed successfully', duration);
  } catch (error) {
    const duration = Date.now() - startTime;
    stepFailure(duration);
    failure('CSS build failed');
    displayEsbuildError(error);
    process.exit(1);
  }
};

main();
