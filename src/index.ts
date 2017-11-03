// internal from node, alphabetic order
import * as path from 'path';

// 3rd party, alphabetic order
import * as gutil from 'gulp-util'
import { defaults } from 'lodash'; // import * as _ from 'lodash';
import * as through from 'through2';

import * as jscodeshiftRunner from 'jscodeshift/dist/runner'

// Consts
const PLUGIN_NAME = 'gulp-jscodeshift';

// Plugin level function(dealing with files)
function jsCodeshift(transformFilePath, opts) {
    if (!transformFilePath) {
        throw new gutil.PluginError(PLUGIN_NAME, 'Missing path to transform file!');
    }

    const _opts = defaults(opts, {
        transform: transformFilePath,
        verbose: 0,
        babel: true,
        extensions: 'js',
        runInBand: false,
        dry: false,
        silent: false
    });

    gutil.log(`${_opts.transform} given, found at ${path.resolve(_opts.transform)}`);

    // Creating a stream through which each file will pass
    return through.obj((file, enc, cb) => {
        jscodeshiftRunner.run(path.resolve(_opts.transform), [file.path], _opts).then(() => cb(null), () => cb(false));
    });
}

// Exporting the plugin main function
module.exports = jsCodeshift;