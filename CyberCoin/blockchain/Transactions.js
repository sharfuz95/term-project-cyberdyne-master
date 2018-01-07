/*jshint esversion: 6 */
const trans = require('./transaction');
const ram = require('ramda');

class Transactions extends Array {

  static transFromJSON(data){
    let transactions = new Transactions();
    ram.forEach((transaction) => {transactions.push(trans.transFromJSON(transaction));}, data);
    return transactions;
  }
}

module.exports = Transactions; 
