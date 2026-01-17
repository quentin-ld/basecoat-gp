import { exec } from 'child_process';
import {
  formatTime,
  header,
  stepStart,
  stepSuccess,
  stepFailure,
  displayCommandError,
  displaySummary,
  displayTotalTime,
  failure
} from './terminal.js';

const run = (stepNumber, totalSteps, stepName, cmd) =>
  new Promise((resolve, reject) => {
    const startTime = Date.now();
    stepStart(stepNumber, totalSteps, stepName);
    
    exec(cmd, (err, stdout, stderr) => {
      const duration = Date.now() - startTime;
      
      if (err) {
        stepFailure(duration);
        displayCommandError(stepName, cmd, stderr, stdout);
        reject(err);
        return;
      }
      
      stepSuccess(duration);
      resolve({ stdout, duration });
    });
  });

const main = async () => {
  const buildStartTime = Date.now();
  
  const steps = [
    { name: 'Lint SCSS', cmd: 'npm run lint-scss' },
    { name: 'Build CSS', cmd: 'npm run build-css' },
    { name: 'Lint JavaScript', cmd: 'npm run lint-js' },
    { name: 'Lint PHP', cmd: 'npm run lint-php' },
    { name: 'Generate translations', cmd: 'npm run build-i18n' },
    { name: 'Zip theme', cmd: 'npm run zip-theme' }
  ];
  
  header('Starting build process');
  
  try {
    const results = [];
    for (const [i, step] of steps.entries()) {
      const result = await run(i + 1, steps.length, step.name, step.cmd);
      results.push({ ...step, duration: result.duration });
    }
    
    const totalDuration = Date.now() - buildStartTime;
    console.log('');
    header('Build completed successfully', (msg) => msg);
    displaySummary(results);
    displayTotalTime(totalDuration);
    
  } catch (err) {
    const totalDuration = Date.now() - buildStartTime;
    failure('Build failed', totalDuration);
    process.exit(1);
  }
};

main();
