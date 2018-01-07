/* eslint-disable no-console */

import Sequelize from 'sequelize';

// Create the connection to database
const sequelize = new Sequelize('raptor_dev', 'skynet', 'hmfic', {
  host: 'localhost',
  dialect: 'postgres',
  define: {
    timestamps: true,
    paranoid: true,
    version: true,
    underscored: true,
    underscoredAll: true,
    freezeTableName: true,
  },
});

// const PG_URI = process.env.PG_CONN_STRING;

// const sequelize = new Sequelize(`${PG_URI}`);

sequelize
  .authenticate()
  .then(() => {
    console.log('Successful database connection');
  })
  .catch(err => {
    console.error(`Unable to connect to database: ${err}`);
  });

const db = {
  User: sequelize.import('./user'),
  Wallet: sequelize.import('./wallet'), // While this comment is in place, this is where the problem is.
  Bet: sequelize.import('./bets'),
  UserBets: sequelize.import('./UserBets.js'),
};

db.sequelize = sequelize;
// db.Sequelize = Sequelize;

/*

//Relations
db.comments.belongsTo(db.posts);
db.posts.hasMany(db.comments);
db.posts.belongsTo(db.users);
db.users.hasMany(db.posts);

module.exports = db;
*/

db.Wallet.belongsTo(db.User);
db.Bet.belongsTo(db.User);
db.User.hasOne(db.Wallet);
db.User.hasMany(db.Bet);

export default db;
