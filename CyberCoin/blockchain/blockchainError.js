/*jshint esversion: 6 */
const ExtendedError = require('../util/extendedError');

class BlockchainAssertionError extends ExtendedError { }

module.exports = BlockchainAssertionError;
