module.exports = function(file, api) {
    const j = api.jscodeshift;

    return j(file.source)
        .find(j.Identifier)
        .replaceWith((p) => j.identifier(p.node.name.split('').reverse().join('')))
        .toSource({ lineTerminator: '\n' });
};