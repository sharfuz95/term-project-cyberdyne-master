/*jshint esversion: 6 */
const Block = require('./block');
const ram = require('ramda');

class Blocks extends Array {
  static blocksFromJSON(data) {
    let blocks = new Blocks();
    ram.forEach((block) => { blocks.push(Block.blocksFromJSON(block)); }, data);
    return blocks;
  }
}

module.exports = Blocks;
