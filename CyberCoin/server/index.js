/*jshint esversion: 6 */
const express = require('express');
const bodyParser = require('body-parser');
const swagUi = require('swagger-ui-express');
const ram = require('ramda');
const swagDoc = require('./swagger.json');
const block = require('../blockchain/block');
const trans = require('../blockchain/transaction');
const transErr = require('../blockchain/transactionError');
const blockErr = require('../blockchain/blockError');
const hErr = require('./hError');
const argErr = require('../util/argError');
const crypto = require('../util/cryptoUtil');

class HTTPServer {

  constructor(node, blockchain, operator, miner) {
    this.app = express();

    const projectWallet = (wallet) => {
  return{
    id: wallet.id,
    addresses: ram.map((keyPair) => {
      return keyPair.publicKey;
      }, wallet.keyPairs)
  };
 };

    this.app.use(bodyParser.json());
    this.app.use('/api-docs', swagUi.serve, swagUi.setup(swagDoc));

    this.app.get('blockchain/blocks', (req, res) => {
      res.status(200).send(blockchain.getAllBlocks());
    });

    this.app.get();
  }

}
