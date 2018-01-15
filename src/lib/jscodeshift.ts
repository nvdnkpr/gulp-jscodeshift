// internal from node, alphabetic order
import { resolve, join } from 'path';
import { existsSync } from 'fs';

// 3rd party, alphabetic order
import * as gutil from 'gulp-util';
import { defaults } from 'lodash'; 
import * as through from 'through2';
import { Stream, Transform } from 'stream';

const jscodeshift:any = require('jscodeshift');

// Consts
const PLUGIN_NAME = 'gulp-jscodeshift';


export interface CodeShiftOptions {
  flushFile?: null | string;
  transformOptions?: any;
  extensions?: [Function]
}

const defaultOptions:CodeShiftOptions = {
  flushFile: null
};

// Plugin level function(dealing with files)
export function jsCodeshift(transformFilePath:any, options?:CodeShiftOptions):Transform {
  const _options:any = { ...defaultOptions, ...options};

  if (!existsSync(resolve(transformFilePath))) {
    throw new gutil.PluginError(PLUGIN_NAME, `Transform file ${transformFilePath} does not exist`);
  }
  const flushOutput:any[] = [];
  let latestFile:gutil.File;

  if (_options.extensions){
    _options.extensions.forEach((extension:Function) => extension(jscodeshift));
  }
  
  const transformFunction = (file:gutil.File, encoding:string, cb:Function) => {
    let output;
    const transform: any = require(resolve(transformFilePath));
    if (file.contents){
      output = transform(
        { path: file.path, source: file.contents.toString() },
        { j: jscodeshift, jscodeshift },
        _options.transformOptions
      ); 
      latestFile = file;
    }

    if (_options.flushFile){
      // set latest file if not already set, or if the current file was modified more recently.
      latestFile = file;
      flushOutput.push(output);
      cb(null);
    } else {
      file.contents = new Buffer(output);
      cb(null, file);
    }
  };

  const flushFunction = (cb:Function) => {
    let flushFile:gutil.File;

    flushFile = latestFile.clone({contents: false});
    flushFile.path = join(latestFile.base, _options.flushFile);

    flushFile.contents = new Buffer(flushOutput.join(''));
    
    cb(null, flushFile);
  }

  // Creating a stream through which each file will pass
  return _options.flushFile ? through.obj(transformFunction, flushFunction) : through.obj(transformFunction);
}
