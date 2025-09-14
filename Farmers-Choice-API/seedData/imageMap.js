/*
 ES module shim for loading a CommonJS imageMap implementation.
 If you already converted imageMap to ESM, this file can be removed.
*/
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const imageMap = require('./imageMap.cjs');
export default imageMap;
