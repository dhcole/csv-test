# csv-test

A command line application for validating CSV files. Use it for verifying that data files meet defined criteria, like "`age` is a number and greater than 10" or "`email` is a valid email address".

It works by looping through each field of each row and testing the data value against a set of rules. It provides a log of any validation errors it finds.

It uses node.js streams so it can work on large files with little memory consumption, tested with a 3,400,256 row CSV file using an average 53mb of memory completing in 1m49.886s.

## install

At the command line / terminal, run the following:

```sh
npm install -g csv-test
```

## run

Run the `csv-test` command by passing it a configuration file and a CSV file:

```sh
$ csv-test path/to/config.yml path/to/data.csv
```

You will see output about your tests that looks like this:

```sh
✗ [row 1, field email] should be a email (instead of "daveexample.com", which is a string)
2 rows tested
1 error found
```

## configuration

`csv-test` runs by testing your CSV against a configuration file. The configuration file support [yaml](https://en.wikipedia.org/wiki/YAML), which is a human-readable data format. Here is an example configuration file:

```yml
fields:
  name: string
  age:
    type: integer
    greaterThan: 10
    lessThan: 90
  email:
    - required
    - email
```

Start your configuration file with a `fields` key to define the validation settings for each field. Then specify a key for each field you'd like to validate. The values for each key can either be the name of a data type (string, integer, boolean) or an object specifying additional validations, like ranges or regex match patterns. See below for a full list of validations.

The configuration file also supports a `settings` key at the top level, which will configure how the CSV file should be parsed. For instance, `delimiter: ";"` tells the parser to parse on semicolons instead of commas. See the [node-csv-parse documentation](http://csv.adaltas.com/parse/#parser-options) for all available parse options.

## validation options

`csv-test` uses the [anchor](https://github.com/balderdashy/anchor/) library for validating data. Available validation rules include the following (though not all have been tested yet):

| Name of validator | What does it check? | Notes on usage |
|-------------------|---------------------|----------------|
|after| check if `string` date in this record is after the specified `Date` | must be valid javascript `Date` |
|alpha| check if `string` in this record contains only letters (a-zA-Z) | |
|alphadashed|| does this `string` contain only letters and/or dashes? |
|alphanumeric| check if `string` in this record contains only letters and numbers. | |
|alphanumericdashed| does this `string` contain only numbers and/or letters and/or dashes? | |
|array| is this a valid javascript `array` object? | strings formatted as arrays won't pass |
|before| check if `string` in this record is a date that's before the specified date | |
|binary| is this binary data? | If it's a string, it will always pass |
|boolean| is this a valid javascript `boolean` ? | `string`s will fail |
|contains| check if `string` in this record contains the seed | |
|creditcard| check if `string` in this record is a credit card | |
|date| check if `string` in this record is a date | takes both strings and javascript |
|datetime| check if `string` in this record looks like a javascript `datetime`| |
|decimal| | contains a decimal or is less than 1?|
|email| check if `string` in this record looks like an email address | |
|empty| Arrays, strings, or arguments objects with a length of 0 and objects with no own enumerable properties are considered "empty" | lo-dash _.isEmpty() |
|equals| check if `string` in this record is equal to the specified value | `===` ! They must match in both value and type |
|falsey| Would a Javascript engine register a value of `false` on this? | |
|finite| Checks if given value is, or can be coerced to, a finite number | This is not the same as native isFinite which will return true for booleans and empty strings |
|float| check if `string` in this record is of the number type float | |
|hexadecimal| check if `string` in this record is a hexadecimal number | |
|hexColor| check if `string` in this record is a hexadecimal color | |
|in| check if `string` in this record is in the specified array of allowed `string` values | |
|int|check if `string` in this record is an integer | |
|integer| same as above | Im not sure why there are two of these. |
|ip| check if `string` in this record is a valid IP (v4 or v6) | |
|ipv4| check if `string` in this record is a valid IP v4 | |
|ipv6| check if `string` in this record is aa valid IP v6 | |
|is| | something to do with REGEX|
|json| does a try&catch to check for valid JSON. | |
|len| is `integer` > param1 && < param2 | Where are params defined? |
|lowercase| is this string in all lowercase? | |
|max| | |
|maxLength| is `integer` > 0 && < param2 |  |
|min| | |
|minLength| | |
|not| | Something about regexes |
|notContains| | |
|notEmpty| |  |
|notIn| does the value of this model attribute exist inside of the defined validator value (of the same type) | Takes strings and arrays |
|notNull| does this not have a value of `null` ? | |
|notRegex| | |
|null| check if `string` in this record is null | |
|number| is this a number? | NaN is considered a number |
|numeric| checks if `string` in this record contains only numbers | |
|object| checks if this attribute is the language type of Object | Passes for arrays, functions, objects, regexes, new Number(0), and new String('') ! |
|regex| | |
|protected| Should this attribute be removed when `toJSON` is called on a model instance?  | |
|required| Must this model attribute contain valid data before a new record can be created? | |
|string| is this a `string` ?| |
|text| okay, well is <i>this</i> a `string` ?| |
|truthy| Would a Javascript engine register a value of `false` on this? | |
|undefined| Would a javascript engine register this thing as have the value 'undefined' ? | |
|unique| Checks to see if a new record model attribute is unique.  | |
|uppercase| checks if `string` in this record is uppercase | |
|url| checks if `string` in this record is a URL | |
|urlish| Does the `string` in this record contain something that looks like a route, ending with a file extension? | /^\s([^\/]+\.)+.+\s*$/g |
|uuid| checks if `string` in this record is a UUID (v3, v4, or v5) | |
|uuidv3| checks if `string` in this record is a UUID (v3) | |
|uuidv4| checks if `string` in this record is a UUID (v4) | |
source: [Sails.js documentation](https://github.com/balderdashy/sails-docs/blob/master/concepts/ORM/Validations.md)

## public domain

This project is in the worldwide [public domain](LICENSE.md).

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.
