import fs from 'fs';

import { expect } from 'chai'
import { File, PluginError } from 'gulp-util';


import jsCodeshift from '../lib/jscodeshift';

describe('codeshift', () => {
    it('should throw error when called with no transform file', () => {
        expect(() => { jsCodeshift() }).to.throw(PluginError, 'Missing path');
    });
    it('should throw error when called with a non existing transform file', () => {
        expect(() => { jsCodeshift('./test/transforms/non-existing-transform.js') }).to.throw(PluginError, 'does not exist');
    });

    it('should transform correctly', (done) => {
        const jscodeshiftStream = jsCodeshift('./test/transforms/reverse-transform.js', {});

        jscodeshiftStream.on('error', done);
        jscodeshiftStream.on('data', (file) => {
            expect(file).to.exist;
            expect(file.path).to.equal('./test/fixtures/code.input.js');
            expect(file.contents.toString()).to.equal(fs.readFileSync('./test/fixtures/code.output.js', 'utf8'));
            done();
        });

        jscodeshiftStream.write(new File({
            path: './test/fixtures/code.input.js',
            contents: fs.readFileSync('./test/fixtures/code.input.js')
        }));
        jscodeshiftStream.end()
    });

});
