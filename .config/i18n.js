import { exec } from 'child_process';
import { existsSync, readFileSync, mkdirSync } from 'fs';
import { resolve, basename, dirname } from 'path';
import { header, stepStart, stepSuccess, stepFailure, failure } from './terminal.js';

const getTextDomain = () => {
  const styleCssPath = resolve(process.cwd(), 'style.css');
  if (!existsSync(styleCssPath)) return basename(process.cwd());
  
  try {
    const styleContent = readFileSync(styleCssPath, 'utf8');
    const textDomainMatch = styleContent.match(/Text Domain:\s*(.+)/i);
    return textDomainMatch?.[1]?.trim() ?? basename(process.cwd());
  } catch {
    return basename(process.cwd());
  }
};

const main = async () => {
  const startTime = Date.now();
  header('Generating translation files');
  stepStart(1, 1, 'Creating/updating .pot file');

  const wpCliPath = resolve(process.cwd(), 'vendor/wp-cli/wp-cli/bin/wp');
  const textDomain = getTextDomain();
  const potFilePath = `languages/${textDomain}.pot`;
  const potFullPath = resolve(process.cwd(), potFilePath);
  const languagesDir = dirname(potFullPath);

  if (!existsSync(languagesDir)) {
    mkdirSync(languagesDir, { recursive: true });
  }

  const action = existsSync(potFullPath) ? 'Updating' : 'Creating';

  return new Promise((resolve, reject) => {
    const cmd = `bash "${wpCliPath}" i18n make-pot . "${potFilePath}" --domain=${textDomain} --skip-js --skip-theme-json`;

    exec(cmd, { cwd: process.cwd() }, (err, stdout, stderr) => {
      const duration = Date.now() - startTime;
      const fileNowExists = existsSync(potFullPath);

      if (err || !fileNowExists) {
        stepFailure(duration);
        failure('Translation file generation failed');
        reject(err ?? new Error('Translation file was not created'));
        return;
      }

      stepSuccess(duration);
      resolve();
    });
  });
};

main().catch(() => process.exit(1));
