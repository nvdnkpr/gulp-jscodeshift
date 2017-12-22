// internal from node, alphabetic order
import { resolve } from 'path';
import { existsSync } from 'fs';

// 3rd party, alphabetic order
import * as gutil from 'gulp-util';
import { defaults } from 'lodash'; 
import * as through from 'through2';
import { Stream } from 'stream';


const jscodeshift:any = require('jscodeshift');


// Consts
const PLUGIN_NAME = 'gulp-jscodeshift';

// Plugin level function(dealing with files)
export default function jsCodeshift(transformFilePath:any):Stream {
  if (!transformFilePath) {
    throw new gutil.PluginError(PLUGIN_NAME, 'Missing path to transform file!');
  }

  if (!existsSync(resolve(transformFilePath))) {
    throw new gutil.PluginError(PLUGIN_NAME, `Transform file ${transformFilePath} does not exist`);
  }
  // Creating a stream through which each file will pass
  return through.obj((file, encoding, callback) => {
    const transform: any = require(resolve(transformFilePath));
    const out = transform(
      { file: file.path, source: file.contents.toString() },
      { j: jscodeshift, jscodeshift }
    );

    file.contents = new Buffer(out);
    // wrap in new Buffer ?
    callback(null, file);
    // jscodeshiftRunner.run(path.resolve(_opts.transform), [file.path], _opts).then(() => cb(null), () => cb(false));
  });
}

// Exporting the plugin main function
module.exports = jsCodeshift;
