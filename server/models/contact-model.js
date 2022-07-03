module.exports = (sequelize, DataTypes) => {
  return sequelize.define("contacts", {
    contactId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    contactName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 30],
          msg: "Please enter a valid contact name",
        },
      },
    },
    hexAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: 42,
          msg: "Please enter a valid ethereum account address",
        },
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};
