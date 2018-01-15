module.exports = function(file, api, options) {
  const defaultOptions = {
    "prepend": ''
  };
  const _options = Object.assign({}, defaultOptions, options);

  const j = api.jscodeshift;

  return j(file.source)
    .find(j.Identifier)
    .reverse()
    .toSource({ lineTerminator: '\n' });
};
