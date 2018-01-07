/*jshint esversion: 6 */
const myE = require('../util/myerror');
const stat = require('statuses');

class HTTPError extends myE {
  constructor(status, message, context, original) {
    if (!message) {
      message = status + ' - ' + stat[status];
    }

    super(message, context, original);

    if (status) {
      this.status = status;
    }
  }

  errJSON() {
    const { status } = this;
    return Object.assign({ status }, this);
  }
}

module.exports = HTTPError;
