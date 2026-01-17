import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { simpleStepStart, stepSuccess, stepFailure, formatTime } from './terminal.js';

const startTime = Date.now();
simpleStepStart('Zipping theme');

const currentDir = path.basename(process.cwd());
const zipFileName = `${currentDir}.zip`;
const output = fs.createWriteStream(path.join('.', zipFileName));
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  const duration = Date.now() - startTime;
  const size = archive.pointer();
  const sizeStr = size < 1024 ? `${size} bytes` : `${(size / 1024).toFixed(2)} KB`;
  stepSuccess(duration);
  console.log(`  Zipped: ${sizeStr}`);
});

archive.on('error', (err) => {
  const duration = Date.now() - startTime;
  stepFailure(duration);
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
    '.sublime/**',
    '.vscode/**',
    '.config/**',
    'composer.json',
    'composer.lock',
    'conf/**/*',
    'generatepress-settings-*.json',
    'gulpfile.js',
    'node_modules/**',
    'package-lock.json',
    'package.json',
    'vendor/**',
    '*.tar.gz',
    '*.zip'
  ]
});

archive.finalize();
