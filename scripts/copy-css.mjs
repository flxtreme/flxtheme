import fs from 'fs';
import path from 'path';

const src = path.resolve('src/css/flxtheme.css');
const dest = path.resolve('dist/flxtheme.css');

fs.copyFileSync(src, dest);
console.log('Copied flxtheme.css to dist/');
