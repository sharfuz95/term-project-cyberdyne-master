export default (sequelize, DataTypes) => {
  const UserBets = sequelize.define('user_bets', {
    // Shorthand for setting the type, instead of having to do { type: DataTypes.REAL }
    amount: DataTypes.REAL,
    team: DataTypes.STRING,
  });

  return UserBets;
};
