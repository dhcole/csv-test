var _ = require('lodash'),
    chalk = require('chalk'),
    yaml = require('js-yaml'),
    parse = require('csv-parse'),
    validator = require('validator'),
    transform = require('stream-transform');

module.exports = function(yml, stream, validators) {

  var index = 0,
      errorCount = 0,
      config = yaml.safeLoad(yml),
      settings = _.extend({ columns: true }, config.settings),
      parser = parse(settings),
      transformer = transform(testRow);

  if (validators && _.isObject(validators)) addValidators(validators);

  stream.pipe(parser).pipe(transformer);
  stream.on('end', finish);

  function testRow(row) {
    index++;
    _.each(row, function(value, field) {
      var error = testField(value, field, row);
      if (error) console.error(chalk.red(error));
    });
  }

  function testField(value, field, row) {
    var fieldIndex = '✗ [row ' + index + ', field ' + field + '] ',
        rules = config.fields[field],
        output = [];

    rules = _.isString(rules) ? [rules] : rules;

    _.each(rules, function(options, rule) {
      if (_.isArray(rules)) {
        rule = options;
        options = undefined;
      }

      if (_.isObject(rule)) {
        options = _.values(rule)[0];
        rule = _.keys(rule)[0];
      }

      var args = _.isArray(options) ?
            [value].concat(options) : [value, options],
          test = validator[rule];

      if (!test) throw new Error('`' + rule + '` is not a valid rule.');

      this.row = row;
      this.field = field;
      this.value = value;

      if (!test.apply(this, args)) {
        errorCount = errorCount + 1;
        output.push(fieldIndex + '`' + rule + '` failed.');
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

  function addValidators(validators) {
    _.each(validators, function(func, key) {
      validator.extend(key, func);
    });
  }

};
