export default (sequelize, DataTypes) => {
  const Bet = sequelize.define(
    'bet',
    {
      wager: {
        type: DataTypes.INTEGER,
      },
      week: {
        type: DataTypes.STRING(),
      },
      teamBet: {
        type: DataTypes.STRING(),
      },
      isWin: {
        type: DataTypes.INTEGER,
      },
    },
    {
      defaultScope: {
        where: {
          deleted_at: null,
        },
      },
      timestamps: true,
      paranoid: true,
      underscored: true,
      version: true,
      freezeTableName: true,
      tableName: 'bets',
    },
  );

  return Bet;
};
