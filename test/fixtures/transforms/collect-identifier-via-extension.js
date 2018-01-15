module.exports = function(file, api, options) {
  
  const j = api.jscodeshift;

  return j(file.source).collectIdentifierNames().join(',');
};
