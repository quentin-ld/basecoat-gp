import { build, transform } from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import combineMediaQuery from 'postcss-combine-media-query';
import mergeRules from 'postcss-merge-rules';
import sortMediaQueries from 'postcss-sort-media-queries';
import cssDeclarationSorter from 'css-declaration-sorter';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const postcssPlugins = [
  cssDeclarationSorter({ order: 'alphabetical' }),
  autoprefixer,
  combineMediaQuery,
  mergeRules,
  sortMediaQueries({ sort: 'mobile-first' })
];

const postcssProcessor = postcss(postcssPlugins);

const getCssBuildUnminified = (outfile) => ({
  entryPoints: ['assets/scss/theme.scss'],
  outfile,
  bundle: true,
  minify: false,
  sourcemap: true,
  write: false,
  plugins: [
    sassPlugin({
      type: 'css',
      quietDeps: true,
      sourceMap: true,
      outputStyle: 'expanded'
    })
  ],
  logLevel: 'silent'
});

export const jsBuild = {
  entryPoints: ['assets/js/block-variations.js', 'assets/js/theme.js'],
  outdir: 'assets/js',
  bundle: false,
  minify: false,
  sourcemap: true,
  format: 'esm',
  target: 'es2018',
  logLevel: 'info'
};

export const buildCSS = async () => {
  const cssOutputPath = resolve(process.cwd(), 'assets/css/theme.css');
  const cssMapPath = resolve(process.cwd(), 'assets/css/theme.css.map');
  
  const buildResult = await build(getCssBuildUnminified(cssOutputPath));
  
  if (buildResult.errors.length > 0) {
    return { errors: buildResult.errors, warnings: buildResult.warnings };
  }
  
  const outputFiles = buildResult.outputFiles ?? [];
  const cssFile = outputFiles.find(file => file.path === cssOutputPath || file.path.endsWith('.css'));
  const mapFile = outputFiles.find(file => file.path === cssMapPath || file.path.endsWith('.css.map'));
  
  if (!cssFile) {
    throw new Error('CSS output file not found in build result');
  }
  
  const decoder = new TextDecoder();
  let css = decoder.decode(cssFile.contents);
  const sourceMap = mapFile ? decoder.decode(mapFile.contents) : undefined;
  
  const postcssResult = await postcssProcessor.process(css, {
    from: cssOutputPath,
    to: cssOutputPath,
    map: {
      inline: false,
      annotation: false,
      prev: sourceMap
    }
  });
  
  const minifyResult = await transform(postcssResult.css, {
    loader: 'css',
    minify: true,
    sourcemap: postcssResult.map ? 'external' : false,
    sourcefile: cssOutputPath,
    sourcesContent: false
  });
  
  writeFileSync(cssOutputPath, minifyResult.code);
  
  if (minifyResult.map) {
    writeFileSync(cssMapPath, minifyResult.map);
  } else if (postcssResult.map) {
    const mapContent = typeof postcssResult.map === 'string' 
      ? postcssResult.map 
      : postcssResult.map.toString();
    writeFileSync(cssMapPath, mapContent);
  }
  
  return { errors: [], warnings: buildResult.warnings };
};

export const buildJS = async () => ({ errors: [], warnings: [] });

export const buildAll = async () => {
  const results = await Promise.all([buildCSS(), buildJS()]);
  
  return {
    errors: results.flatMap(r => r.errors ?? []),
    warnings: results.flatMap(r => r.warnings ?? [])
  };
};
