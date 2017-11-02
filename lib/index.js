const path = require('path');

const defaults = require('lodash/defaults');
const through = require('through2');

const gutil = require('gulp-util');
const PluginError = gutil.PluginError;

const jscodeshiftRunner = require('jscodeshift/dist/Runner');

// Consts
const PLUGIN_NAME = 'gulp-jscodeshift';

// Plugin level function(dealing with files)
function jsCodeshift(transformFilePath, opts) {
    if (!transformFilePath) {
        throw new PluginError(PLUGIN_NAME, 'Missing path to transform file!');
    }


    const _opts = _.defaults(opts, {
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