module.exports = {
  startsWith: function(str, seed) {
    return str.indexOf(seed) === 0;
  },
  sumFields: function(str) {
    var cols = Array.prototype.slice.call(arguments);
    cols.shift();
    var sum = cols.reduce(function(memo, col) {
      return memo + +this.row[col];
    }, 0);
    return sum === +str;
  }
};
