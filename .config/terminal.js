import chalk from 'chalk';

const WIDTH = 60;

export const formatTime = (ms) => (ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`);

export const separator = (char = '=', color = chalk.cyan) => console.log(color(char.repeat(WIDTH)));

export const header = (title, color = chalk.cyan) => {
  console.log('');
  separator('=', color);
  console.log(color(title));
  separator('=', color);
  console.log('');
};

export const subSeparator = (char = '-', color = chalk.cyan) => console.log(color(char.repeat(WIDTH)));

export const stepStart = (stepNumber, totalSteps, stepName) => {
  process.stdout.write(chalk.cyan(`[${stepNumber}/${totalSteps}] ${stepName}... `));
};

export const stepSuccess = (duration) => console.log(chalk.green(`OK (${formatTime(duration)})`));

export const stepFailure = (duration) => console.log(chalk.red(`FAILED (${formatTime(duration)})`));

export const simpleStepStart = (stepName) => process.stdout.write(chalk.cyan(`${stepName}... `));

export const success = (message, duration = null) => {
  console.log('');
  separator('=', chalk.cyan);
  console.log(chalk.green(message));
  separator('=', chalk.cyan);
  if (duration !== null) {
    console.log(`  Total time: ${chalk.green(formatTime(duration))}`);
  }
  separator('=', chalk.cyan);
  console.log('');
};

export const failure = (message, duration = null) => {
  console.log('');
  separator('=', chalk.red);
  console.log(duration !== null ? chalk.red(`${message} after ${formatTime(duration)}`) : chalk.red(message));
  separator('=', chalk.red);
  console.log('');
};

export const displayEsbuildError = (error) => {
  if (error.errors?.length > 0) {
    console.log(chalk.yellow('Errors:'));
    error.errors.forEach((err) => {
      console.log(chalk.gray(`  ${err.text}`));
      if (err.location) {
        console.log(chalk.gray(`    at ${err.location.file}:${err.location.line}:${err.location.column}`));
      }
    });
    console.log('');
  }
  
  if (error.warnings?.length > 0) {
    console.log(chalk.yellow('Warnings:'));
    error.warnings.forEach((warn) => console.log(chalk.gray(`  ${warn.text}`)));
    console.log('');
  }
  
  if (!error.errors && !error.warnings) {
    console.log(chalk.gray(String(error)));
    console.log('');
  }
};

export const displayCommandError = (stepName, cmd, stderr, stdout) => {
  console.log('');
  separator('=', chalk.red);
  console.log(chalk.red(`ERROR in step: ${stepName}`));
  console.log(chalk.red(`Command: ${cmd}`));
  separator('=', chalk.red);
  console.log('');
  
  if (stderr) {
    console.log(chalk.yellow('STDERR:'));
    console.log(chalk.gray(stderr));
    console.log('');
  }
  
  if (stdout) {
    console.log(chalk.yellow('STDOUT:'));
    console.log(chalk.gray(stdout));
    console.log('');
  }
  
  separator('=', chalk.red);
  console.log('');
};

export const displaySummary = (results) => {
  console.log(chalk.yellow('Step Summary:'));
  console.log('');
  
  results.forEach((result, index) => {
    const stepLabel = `[${index + 1}/${results.length}]`;
    console.log(`  ${stepLabel} ${result.name.padEnd(25)} ${chalk.gray(formatTime(result.duration))}`);
  });
  
  console.log('');
  subSeparator('-', chalk.cyan);
};

export const displayTotalTime = (duration) => {
  console.log(`  Total build time: ${chalk.green(formatTime(duration))}`);
  separator('=', chalk.cyan);
  console.log('');
};
