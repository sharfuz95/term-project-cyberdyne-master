/*jshint esversion: 6 */
const crypto = require("../util/cryptoUtil");
const ed = require("../util/cryptoUtil");
const ram = require("ramda");
const transError = require("../blockchain/transactionError");
const transFee = 0.25;

class Transaction {
  construct() {
    this.id = null;
    this.hash = null;
    this.type = null;
    this.data = {
      inputs: [],
      outputs: []
    };
  }

  transHash() {
    return crypto.hash(this.id + this.hash + JSON.stringify(this.data));
  }

  checkHashValid() {
    let thashValid = this.hash === this.transHash();

    if (!thashValid) {
      console.error(`Invalid hash yo! '${this.hash}'`, this);
      throw new transError(`Invalid hash yo! '${this.hash}'`, this);
    }

    ram.map(input => {
      let inputHash = crypto.hash({
        transaction: input.transaction,
        index: input.index,
        address: input.address
      });
      let valSig = ed.verifySignature(
        input.address,
        input.signature,
        inputHash
      );

      if (!valSig) {
        console.error(
          `Invalid transaction signature yo! '${JSON.stringify(input)}'`
        );
        throw new transError(
          `Invalid transaction signature yo! '${JSON.stringify(input)}'`
        );
      }
    }, this.data.inputs);
    if (this.type === "regular") {
      let inputAmt = ram.sum(ram.map(ram.prop("amount"), this.data.inputs));
      let outAmt = ram.sum(ram.map(ram.prop("amount"), this.data.outputs));

      let inputGorEOutput = ram.gte(inputAmt, outAmt);

      if (!inputGorEOutput) {
        console.error(
          `That balance isn't right! '${JSON.stringify(
            inputAmt
          )}', '${JSON.stringify(outAmt)}'`
        );
        throw new transError(
          `That balance isnt right man! '${JSON.stringify(
            inputAmt
          )}', '${JSON.stringify(outAmt)}'`
        );
      }

      let validFee = inputAmt - outAmt >= transFee;

      if (!validFee) {
        console.error(
          `Fee too low! Expected: '${transFee}' , Received: '${inputAmt -
            outAmt}'`
        );
        throw new transError(
          `Fee too low! Expected: '${transFee}' , Received: '${inputAmt -
            outAmt}'`
        );
      }
    }
    return true;
  }

  static transFromJSON(data) {
    let trans = new Transaction();
    ram.forEachObjIndexed((value, key) => {
      trans[key] = value;
    }, data);
    trans.hash = trans.transHash();
    return trans;
  }
}

module.export = Transaction;
