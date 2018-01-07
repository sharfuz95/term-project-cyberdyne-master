/*jshint esversion: 6 */
const Eve = require('events');
const ram = require('ramda');
const blocks = require('./blocks');
const block = require('./block');
const db = require('../util/database');
const trans = require('./transactions');
const transErr = require('./transactionError');
const blockErr = require('./blockError');
const blockchainErr = require('./blockchainError');

// Database settings
const BLOCKCHAIN_FILE = 'blocks.json';
const TRANSACTIONS_FILE = 'transactions.json';

// Proof-of-work difficulty settings
const BASE_DIFFICULTY = Number.MAX_SAFE_INTEGER;
const INCREASE_PERIOD = 10;
const DIFINCREASE = 5;

// Mining settings
// INFO: Usually the mining reward decreases over time.
const MINING_REWARD = 5000;

class Blockchain {
  constructor(dbName) {
    //this is where we want to link up the blockchain to the database
    this.blocksDb = new db('data/' + dbName + '/' + BLOCKCHAIN_FILE, new blocks());
    this.transactionsDb = new db('data/' + dbName + '/' + TRANSACTIONS_FILE, new trans());

    // INFO: In this implementation the database is a file and every time data is saved it rewrites the file, probably it should be a more robust database for performance reasons
    this.blocks = this.blocksDb.read(blocks);
    this.transactions = this.transactionsDb.read(trans);

    // Some places uses the emitter to act after some data is changed
    this.emitter = new Eve();
    this.init();
  }

  init() {
    if (this.blocks.length === 0) {
      console.info('Blockchain is empty, adding genesis block');
      this.blocks.push(block.makeGenBlock);
      //write to database here
    }

    console.info('Clearing blockchain!');
    ram.forEach(this.removeTrans.bind(this), this.blocks);
  }

  getAllBlocks() {
    return this.blocks;
  }

  getBlockByIndex(index) {
    return ram.find(ram.propEq('index', index), this.blocks);
  }

  getBlockByHash(hash) {
    return ram.find(ram.propEq('hash', hash), this.blocks);
  }

  getLastBlock() {
    return ram.last(this.blocks);
  }

  getDifficulty(index) {
    return Math.max(
      Math.floor(
        BASE_DIFFICULTY / Math.pow(
        Math.floor(((index || this.blocks.length) + 1) / INCREASE_PERIOD) + 1, DIFINCREASE)), 0);
  }

  getAllTrans() {
    return this.transactions;
  }

  getTransByID(id) {
    return ram.find(ram.propEq('id', id), this.transactions);
  }

  getTransFromBlocks(transID) {
    return ram.find(ram.compose(ram.find(ram.propEq('id', transID)), ram.prop('transactions')), this.blocks);
  }

  replaceChain(newBChain) {
    //Given a conflict, the longer blockchain should be chosen, thus it
    //does not make sense to replace the current blockchain by a smaller one

    if (newBChain.length <= this.blocks.length) {
      console.error('Blockchain given for replacement is shorter than current Blockchain!');
      throw new blockchainErr('Blockchain given for replacement is shorter than current Blockchain!');
    }

    this.verifyChain(newBChain);

    console.info('Received blockchain is valid! Replacing...');

    let newBlocks = ram.takeLast(newBChain.length - this.blocks.length, newBChain);

    ram.forEach((block) => {
      this.addBlock(block, false);
    }, newBlocks);

    this.emitter.emit('blockchainReplaced', newBlocks);
  }

  verifyChain(blockchain) {
    if (JSON.stringify(blockchain[0]) !== JSON.stringify(block.makeGenBlock)) {
      console.error('Genesis blocks aren\'t the same');
    }

    try {
      for (let i = 1; i < blockchain.length; i++) {
        this.verifyChain(blockchain[i], blockchain[i - 1]);
      }
    } catch (err) {
      console.error('Block sequence is erroneous!');
      throw new blockchainErr('Block sequence is erroneous!');
    }
    return true;
  }

  addBlock(newBlock, emit = true) {
    if (this.verifyChain(newBlock, this.getLastBlock())) {
      this.blocks.push(newBlock);

      //this should write to postgreSQL database
      this.blocksDb.write(this.blocks);

      console.info(`Block added: ${newBlock.hash}`);
      console.debug(`Block added: ${JSON.stringify(newBlock)}`);
      if (emit) {
        this.eitter.emit('blockAdded', newBlock);
      }
    }
  }

  addTrans(newTrans, emit = true){

    if(this.verifyTrans(newTrans)){
      this.transactions.push(newTrans);
      this.transactionsDb.write(this.transactions);

      console.info(`Transaction added: ${newTrans.id}`);
      console.debug(`Transaction added: ${JSON.stringify(newTrans)}`);

      if(emit){
        this.emmiter.emit('tranAdded', newTrans);
      }

      return newTrans;
    }
  }

  rmBTFtrans(newBlock){
    this.transactions = ram.reject((transaction) => {return ram.find(ram.propEq('id', transaction.id),newBlock.transactions);}, this.transactions);
    this.transactionsDb.write(this.transactions);
  }

  verifyBlock(newBlock, prevBlock){
    const blockHash = newBlock.blockHash();

    //check if block is last block
    if(prevBlock.index + 1 !== newBlock.index){
      console.error(`Invalid index: expected '${prevBlock.index + 1}' got '${newBlock.index}'`);
      throw new blockErr(`Invalid index: expected '${prevBlock.index + 1}' got '${newBlock.index}'`);
    }else if(prevBlock.hash !== newBlock.previousHash){
      console.error(`Invalid previoushash: expected '${prevBlock.hash}' got '${newBlock.previousHash}'`);
      throw new blockErr(`Invalid previoushash: expected '${prevBlock.hash}' got '${newBlock.previousHash}'`);
    }else if (blockHash !== newBlock.hash) { // Check if the hash is correct
      console.error(`Invalid hash: expected '${blockHash}' got '${newBlock.hash}'`);
      throw new blockErr(`Invalid hash: expected '${blockHash}' got '${newBlock.hash}'`);
    } else if (newBlock.getDifficulty() >= this.getDifficulty(newBlock.index)) { // If the difficulty level of the proof-of-work challenge is correct
      console.error(`Invalid proof-of-work difficulty: expected '${newBlock.getDifficulty()}' to be smaller than '${this.getDifficulty(newBlock.index)}'`);
      throw new blockErr(`Invalid proof-of-work difficulty: expected '${newBlock.getDifficulty()}' be smaller than '${this.getDifficulty()}'`);
    }

    ram.forEach(this.verifyTrans.bind(this), newBlock.transactions);

    let sumInput = ram.sum(ram.flatten(ram.map(ram.compose(ram.map(ram.prop('amount')), ram.prop('inputs'), ram.prop('data')),newBlock.transactions))) + MINING_REWARD;
    let sumOutput = ram.sum(ram.flatten(ram.map(ram.compose(ram.map(ram.prop('amount')), ram.prop('outputs'), ram.prop('data')),newBlock.transactions)));

    let inputGEToutput = ram.gte(sumInput, sumOutput);

    if(!inputGEToutput){
      console.error(`Invalid block balance: inputs sum '${sumInput}', outputs sum '${sumOutput}'`);
      throw new blockErr(`Invalid block balance: inputs sum '${sumInput}', outputs sum '${sumOutput}'`, { sumInput, sumOutput });
    }

    //check only 1 fee trans and 1 reward trans!
    let transByType = ram.countBy(ram.prop('type'), newBlock.transactions);

    if(transByType.fee && transByType.fee > 1){
      console.error(`Invalid fee transaction count: expected '1' got '${transByType.fee}'`);
      throw new blockErr(`Invalid fee transaction count: expected '1' got '${transByType.fee}'`);
    }

    if (transByType.reward && transByType.reward > 1) {
      console.error(`Invalid reward transaction count: expected '1' got '${transByType.reward}'`);
      throw new blockErr(`Invalid reward transaction count: expected '1' got '${transByType.reward}'`);
    }

    return true;
  }

  verifyTrans(trans){
    trans.checkHashValid(trans);

    let notInChain = ram.all((block) => {
      return ram.none(ram.propEq('id', trans.id), block.transactions);
    }, this.blocks);

    if(!notInChain){
      console.error(`Transaction '${trans.id}' is already in the blockchain`);
      throw new transErr(`Transaction '${trans.id}' is already in the blockchain`, trans);
    }

    let isInputTransUnspent = ram.all(ram.equals(false), ram.flatten(ram.map((transInput) => {
      return ram.map(ram.pipe(ram.prop('transactions'), ram.map(ram.pipe(ram.path(['data', 'inputs']),ram.contains({transaction: transInput.transaction, index: transInput.index})))), this.blocks);
    }, trans.data.inputs)));

    if (!isInputTransUnspent) {
      console.error(`Not all inputs are unspent for transaction '${trans.id}'`);
      throw new transErr(`Not all inputs are unspent for transaction '${trans.id}'`, trans.data.inputs);
    }

    return true;
  }

}

module.exports = Blockchain;
