module.exports = function(file, api, options) {
  const defaultOptions = {
    "prepend": ''
  };
  const _options = Object.assign({}, defaultOptions, options);

  const j = api.jscodeshift;

  return j(file.source)
    .find(j.Identifier)
    .replaceWith((p) => j.identifier(_options.prepend + p.node.name.split('').reverse().join('')))
    .toSource({ lineTerminator: '\n' });
};
