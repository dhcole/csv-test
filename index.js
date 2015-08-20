var _ = require('lodash'),
    chalk = require('chalk'),
    yaml = require('js-yaml'),
    anchor = require('anchor'),
    parse = require('csv-parse'),
    transform = require('stream-transform');

module.exports = function(yml, stream) {

  var index = 0,
      errorCount = 0,
      config = yaml.safeLoad(yml),
      settings = _.extend({ columns: true, auto_parse: true}, config.settings),
      parser = parse(settings),
      transformer = transform(testRow);

  stream.pipe(parser).pipe(transformer);
  stream.on('end', finish);

  function testRow(row) {
    index++;
    _.each(row, function(value, field) {
      var error = testField(value, field);
      if (error) console.error(chalk.red(error));
    });
  }

  function testField(value, field) {
    var fieldIndex = '✗ [row ' + index + ', field ' + field + '] ',
        rules = config.fields[field],
        output = [];
    if (!rules) return;
    rules = typeof rules !== 'object' ? [{ type: rules }] :
            _.isArray(rules) ? rules.map(function(r) { return { type: r }; }) :
            [rules];
    rules.forEach(function(rule) {
      var errors = anchor(value).to(rule);
      if (errors) {
        errorCount = errorCount + errors.length;
        output.push(fieldIndex + _(errors).pluck('message').join('; ')
          .replace(/\`undefined\` /g, '')
          .replace(/\[object Object\]/g, 'Unable to validate'));
      }
    });
    return output.join('\n');
  }

  function finish() {
    console.log(index + ' rows tested');
    if (errorCount) {
      var label = errorCount === 1 ? ' error' : ' errors';
      console.log(chalk.red(errorCount + label + ' found'));
      process.exit(1);
    } else {
      console.log(chalk.green('no errors found'));
      process.exit(0);
    }
  }

};
