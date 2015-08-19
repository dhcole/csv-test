var tape = require('tape'),
    exec = require('child_process').exec;

tape('execute CLI script', function(t) {
  var command = 'csv-test test/fixtures/test.yml test/fixtures/test.csv';
  exec(command, function(error, stdout, stderr) {
    if (error) console.error(error);
    t.plan(1);
    t.assert(!error, 'runs without error');
  });
});
