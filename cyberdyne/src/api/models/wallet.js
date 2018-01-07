export default (sequelize, DataTypes) => {
  const Wallet = sequelize.define(
    'wallet',
    {
      name: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
      },
      balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1500,
      },
      realUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      tableName: 'wallets',
    },
  );

  // Wallet.associate = models => Wallet.belongsTo(models.User);

  return Wallet;
};
