import {readFileSync} from 'fs';

import { File, PluginError } from 'gulp-util';

import { expect } from '../chai-setup';

import {jsCodeshift} from '../../src/index';

describe('codeshift', () => {
    it('should throw error when called with a non existing transform file', () => {
        expect(() => { jsCodeshift('./test/transforms/non-existing-transform.js') }).to.throw(PluginError, 'does not exist');
    });

    describe('transform without options', () => {
      it('should transform correctly', (done) => {
          const jscodeshiftStream = jsCodeshift('./test/fixtures/transforms/reverse-transform.js');
  
          jscodeshiftStream.on('error', done);
          jscodeshiftStream.on('data', (file:File) => {
              expect(file).to.exist;
              expect(file.path).to.equal('./test/fixtures/code.input.js');
              expect(file.contents.toString()).to.equal(readFileSync('./test/fixtures/code.output.js', 'utf8'));
              done();
          });
          
          jscodeshiftStream.write(new File({
              path: './test/fixtures/code.input.js',
              contents: readFileSync('./test/fixtures/code.input.js')
          }));
          jscodeshiftStream.end()
      });
  
      it('should transform correctly with transform options', (done) => {
        const jscodeshiftStream = jsCodeshift('./test/fixtures/transforms/reverse-transform.js', {transformOptions: {prepend: 'abc_'}});
  
        jscodeshiftStream.on('error', done);
        jscodeshiftStream.on('data', (file:File) => {
            expect(file).to.exist;
            expect(file.path).to.equal('./test/fixtures/code.input.js');
            expect(file.contents.toString()).to.equal(readFileSync('./test/fixtures/code-prepend.output.js', 'utf8'));
            done();
        });
  
        jscodeshiftStream.write(new File({
            path: './test/fixtures/code.input.js',
            contents: readFileSync('./test/fixtures/code.input.js')
        }));
        jscodeshiftStream.end()
      });
      
      it('should transform correctly with flushFile option', (done) => {
        const jscodeshiftStream = jsCodeshift('./test/fixtures/transforms/reverse-transform.js', {
          flushFile: 'flushed'
        });

        jscodeshiftStream.on('error', done);
        jscodeshiftStream.on('data', (file:File) => {
          expect(file).to.exist;
          expect(file.path).to.equal('test/fixtures/flushed');
          expect(file.contents.toString()).to.equal(readFileSync('./test/fixtures/code.output.js', 'utf8'));
          done();
        });

        const file1 = new Buffer("var myHeading = document.querySelector('h1');\n");
        const file2 = new Buffer("myHeading.textContent = 'Hello world!';\n");
        jscodeshiftStream.write(new File({ base: './test/fixtures', path: './test/fixtures/hello', contents: file1 }));
        jscodeshiftStream.write(new File({ base: './test/fixtures', path: './test/fixtures/hello', contents: file2 }));
        jscodeshiftStream.end();
      });
      
      it('should transform correctly with transform options', (done) => {
        const testExtensions = require('../fixtures/reverse-extension');
        const jscodeshiftStream = jsCodeshift('./test/fixtures/transforms/reverse-transform.js', {
          extensions:[ testExtensions ]
        });
  
        jscodeshiftStream.on('error', done);
        jscodeshiftStream.on('data', (file:File) => {
            expect(file).to.exist;
            expect(file.path).to.equal('./test/fixtures/code.input.js');
            expect(file.contents.toString()).to.equal(readFileSync('./test/fixtures/code.output.js', 'utf8'));
            done();
        });
  
        jscodeshiftStream.write(new File({
            path: './test/fixtures/code.input.js',
            contents: readFileSync('./test/fixtures/code.input.js')
        }));
        jscodeshiftStream.end()
      });

      it('should transform correctly with transform and flushFile option', (done) => {
        const testExtensions = require('../fixtures/collect-extension');
        const jscodeshiftStream = jsCodeshift('./test/fixtures/transforms/collect-identifier-via-extension.js', {
          extensions:[testExtensions],
          flushFile: 'collects'
        });
  
        jscodeshiftStream.on('error', done);
        jscodeshiftStream.on('data', (file:File) => {
            expect(file).to.exist;
            expect(file.path).to.equal('test/fixtures/collects');
            expect(file.contents.toString()).to.equal('myHeading,document,querySelector,myHeading,textContent');
            done();
        });
  
        jscodeshiftStream.write(new File({
            base : './test/fixtures',
            path: './test/fixtures/code.input.js',
            contents: new Buffer(`
              var myHeading = document.querySelector('h1');
              myHeading.textContent = 'Hello world!';
            `)
        }));
        jscodeshiftStream.end()
      });

  });

});
