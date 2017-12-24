const defaultOptions = {
  prepend: ''
};
module.exports = function(file, api, options = defaultOptions) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.Identifier)
    .replaceWith((p) => j.identifier(options.prepend + p.node.name.split('').reverse().join('')))
    .toSource({ lineTerminator: '\n' });
};
