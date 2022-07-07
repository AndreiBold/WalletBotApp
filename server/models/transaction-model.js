module.exports = (sequelize, DataTypes) => {
  return sequelize.define("transactions", {
    txId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    from: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: 42,
          msg: "Please enter a valid ethereum address",
        },
      },
    },
    to: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: 42,
          msg: "Please enter a valid ethereum address",
        },
      },
    },
    amount: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hashLink: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};
