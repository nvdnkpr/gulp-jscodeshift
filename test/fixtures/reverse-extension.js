module.exports = (j) => {
  j.registerMethods({
    reverse: function() {
      return this.replace((path) => j.identifier(path.node.name));
    }
  }, j.Identifier);
}
