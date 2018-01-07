/*jshint esversion: 6 */
const ExtendedError = require('./myerror');

class ArgumentError extends ExtendedError { }

module.exports = ArgumentError;
