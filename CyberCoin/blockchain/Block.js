/*jshint esversion: 6 */
const ram = require("ramda");
const cryptoUtil = require("../util/cryptoUtil");
const transaction = require("./transaction");
const transactions = require("./transactions");
const genDate = new Date();
let date = new Date();

class Block {
  blockHash() {
    return cryptoUtil.hash(
      this.index +
        this.previousHash +
        this.timestamp +
        this.nonce +
        JSON.stringify(this.transactions)
    );
  }

  getCurrDifficulty() {
    return parseInt(this.hash.substring(0, 14), 16);
  }

  static get makeGenBlock() {
    let genBlock = Block.blockFromJSON({
      index: 0,
      previousHash: "0",
      timestamp: genDate,
      nonce: 0,
      transactions: [
        transaction.transFromJSON({
          id:
            "3t7huebwwdrz4g23wnerj06z9qgbb5pdd4148idd0bvys0pdh4mw8dqrsrjeg4n8",
          hash: null,
          type: "regular",
          data: {
            inputs: [],
            outputs: []
          }
        })
      ]
    });

    return genBlock;
  }

  static blockFromJSON(data) {
    let block = new Block();
    ram.forEachObjIndexed((value, key) => {
      if (key === "transactions" && value) {
        block[key] = transactions.transFromJSON(value);
      } else {
        block[key] = value;
      }
    }, data);

    block.hash = block.blockHash();
    return block;
  }
}

module.exports = Block;
