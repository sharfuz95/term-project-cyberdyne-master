/* eslint-disable no-unused-vars */

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      /* The following key-value pairs are the column definitions */
      email: {
        type: DataTypes.STRING(100),
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      displayName: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        field: 'is_admin',
        defaultValue: false,
      },
      password: {
        type: DataTypes.STRING(72),
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
      tableName: 'users',
    },
  );

  return User;
};
