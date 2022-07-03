module.exports = (sequelize, DataTypes) => {
  return sequelize.define("address", {
    hexValue: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
      validate: {
        len: {
          args: 42,
          msg: "Please enter a valid ethereum address",
        },
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 30],
          msg: "Please enter a valid ethereum address name",
        },
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};
