var tape = require('tape'),
    exec = require('child_process').exec;

tape('execute CLI script', function(t) {
  var command = 'bin/csv-test test/fixtures/test.yml test/fixtures/test.csv';
  exec(command, function(error, stdout, stderr) {
    if (error) console.error(error);
    t.plan(1);
    t.assert(!error, 'runs without error');
  });
});

tape('allow fields without rules', function(t) {
  var command = 'bin/csv-test test/fixtures/undefinedFields.yml test/fixtures/test.csv';
  exec(command, function(error, stdout, stderr) {
    if (error) console.error(error);
    t.plan(1);
    t.assert(!error, 'runs without error');
  });
});

tape('support custom rules', function(t) {
  var command = 'bin/csv-test test/fixtures/customValidators.yml test/fixtures/customValidators.csv test/fixtures/customValidators.js';
  exec(command, function(error, stdout, stderr) {
    if (error) console.error(error);
    t.plan(1);
    t.assert(!error, 'runs without error');
  });
});
