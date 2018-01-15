module.exports = (j) => {
  j.registerMethods({
    collectIdentifierNames: function() {
      const identifierNames = []
      this.find(j.Identifier).forEach((path) => identifierNames.push(path.node.name));

      return identifierNames;
    }
  });
}
