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
✗ [row 2, field email] `isEmail` failed.
2 rows tested
1 error found
```

## configuration

`csv-test` runs by testing your CSV against a configuration file. The configuration file support [yaml](https://en.wikipedia.org/wiki/YAML), which is a human-readable data format. Here is an example configuration file:

```yml
fields:
  name:
    - isLength:
      - 1
      - 10
  age:
    - isInt:
        max: 90
        min: 10
  email: isEmail
```

Start your configuration file with a `fields` key to define the validation settings for each field. Then specify a key for each field you'd like to validate. The values for each key can either be the name of a data type (string, integer, boolean) or an object specifying additional validations, like ranges or regex match patterns. See below for a full list of validations. Fields that do not have rules specified will be skipped.

Field validation settings can take a number of forms. For fields with only one rule, they can be strings, such as `age: isInt`.

For fields with multiple rules or rules that take named options, use the array form:

```yaml
age:
  - isNumeric
  - isInt:
      max: 90
      min: 10
```

Some rules take options as an array, such as `isLength`. Those rules should list options as an array:

```yml
name:
  - isLength:
    - 1
    - 10
```

Rules that only take one option can be written as follows:

```yml
state:
  contains: NJ
```

The configuration file also supports a `settings` key at the top level, which will configure how the CSV file should be parsed. For instance, `delimiter: ";"` tells the parser to parse on semicolons instead of commas. See the [node-csv-parse documentation](http://csv.adaltas.com/parse/#parser-options) for all available parse options.

## validation options

`csv-test` uses the [validator.js](https://github.com/chriso/validator.js) library for validating data. Available validation rules include the following:

### Validators

- **contains(str, seed)** - check if the string contains the seed.
- **equals(str, comparison)** - check if the string matches the comparison.
- **isAfter(str [, date])** - check if the string is a date that's after the specified date (defaults to now).
- **isAlpha(str)** - check if the string contains only letters (a-zA-Z).
- **isAlphanumeric(str)** - check if the string contains only letters and numbers.
- **isAscii(str)** - check if the string contains ASCII chars only.
- **isBase64(str)** - check if a string is base64 encoded.
- **isBefore(str [, date])** - check if the string is a date that's before the specified date.
- **isBoolean(str)** - check if a string is a boolean.
- **isByteLength(str, min [, max])** - check if the string's length (in bytes) falls in a range.
- **isCreditCard(str)** - check if the string is a credit card.
- **isCurrency(str, options)** - check if the string is a valid currency amount. `options` is an object which defaults to `{symbol: '$', require_symbol: false, allow_space_after_symbol: false, symbol_after_digits: false, allow_negatives: true, parens_for_negatives: false, negative_sign_before_digits: false, negative_sign_after_digits: false, allow_negative_sign_placeholder: false, thousands_separator: ',', decimal_separator: '.', allow_space_after_digits: false }`.
- **isDate(str)** - check if the string is a date.
- **isDecimal(str)** - check if the string represents a decimal number, such as 0.1, .3, 1.1, 1.00003, 4.0, etc.
- **isDivisibleBy(str, number)** - check if the string is a number that's divisible by another.
- **isEmail(str [, options])** - check if the string is an email. `options` is an object which defaults to `{ allow_display_name: false, allow_utf8_local_part: true, require_tld: true }`. If `allow_display_name` is set to true, the validator will also match `Display Name <email-address>`. If `allow_utf8_local_part` is set to false, the validator will not allow any non-English UTF8 character in email address' local part. If `require_tld` is set to false, e-mail addresses without having TLD in their domain will also be matched.
- **isFQDN(str [, options])** - check if the string is a fully qualified domain name (e.g. domain.com). `options` is an object which defaults to `{ require_tld: true, allow_underscores: false, allow_trailing_dot: false }`.
- **isFloat(str [, options])** - check if the string is a float. `options` is an object which can contain the keys `min` and/or `max` to validate the float is within boundaries (e.g. `{ min: 7.22, max: 9.55 }`).
- **isFullWidth(str)** - check if the string contains any full-width chars.
- **isHalfWidth(str)** - check if the string contains any half-width chars.
- **isHexColor(str)** - check if the string is a hexadecimal color.
- **isHexadecimal(str)** - check if the string is a hexadecimal number.
- **isIP(str [, version])** - check if the string is an IP (version 4 or 6).
- **isISBN(str [, version])** - check if the string is an ISBN (version 10 or 13).
- **isISIN(str)** - check if the string is an [ISIN][ISIN] (stock/security identifier).
- **isISO8601(str)** - check if the string is a valid [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) date.
- **isIn(str, values)** - check if the string is in a array of allowed values.
- **isInt(str [, options])** - check if the string is an integer. `options` is an object which can contain the keys `min` and/or `max` to check the integer is within boundaries (e.g. `{ min: 10, max: 99 }`).
- **isJSON(str)** - check if the string is valid JSON (note: uses JSON.parse).
- **isLength(str, min [, max])** - check if the string's length falls in a range. Note: this function takes into account surrogate pairs.
- **isLowercase(str)** - check if the string is lowercase.
- **isMobilePhone(str, locale)** - check if the string is a mobile phone number, (locale is one of `['zh-CN', 'en-ZA', 'en-AU', 'en-HK', 'pt-PT', 'fr-FR', 'el-GR', 'en-GB', 'en-US', 'en-ZM', 'ru-RU']`).
- **isMongoId(str)** - check if the string is a valid hex-encoded representation of a [MongoDB ObjectId][mongoid].
- **isMultibyte(str)** - check if the string contains one or more multibyte chars.
- **isNull(str)** - check if the string is null.
- **isNumeric(str)** - check if the string contains only numbers.
- **isSurrogatePair(str)** - check if the string contains any surrogate pairs chars.
- **isURL(str [, options])** - check if the string is an URL. `options` is an object which defaults to `{ protocols: ['http','https','ftp'], require_tld: true, require_protocol: false, require_valid_protocol: true, allow_underscores: false, host_whitelist: false, host_blacklist: false, allow_trailing_dot: false, allow_protocol_relative_urls: false }`.
- **isUUID(str [, version])** - check if the string is a UUID (version 3, 4 or 5).
- **isUppercase(str)** - check if the string is uppercase.
- **isVariableWidth(str)** - check if the string contains a mixture of full and half-width chars.
- **matches(str, pattern [, modifiers])** - check if string matches the pattern. For example: `matches('foo', 'foo', 'i')`.

[mongoid]: http://docs.mongodb.org/manual/reference/object-id/
[ISIN]: https://en.wikipedia.org/wiki/International_Securities_Identification_Number

source: [validator.js documentation](https://github.com/chriso/validator.js/blob/master/README.md#validators)

## public domain

This project is in the worldwide [public domain](LICENSE.md).

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.
