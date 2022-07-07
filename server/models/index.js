const fs = require("fs");
const Sequelize = require("sequelize");
require("dotenv").config();
//setting db connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    define: {
      timestamps: false,
    },
    // logging: false,
  }
);

//mapping each model file (except index.js) to it's keyname
let db = {};
fs.readdirSync(__dirname).forEach((file) => {
  if (file !== "index.js") {
    let keyName = file.split(".")[0].split("-")[0];
    keyName = keyName[0].toUpperCase() + keyName.slice(1, keyName.length);
    let moduleName = file.split(".")[0];
    db[keyName] = sequelize.import(moduleName);
  }
});

//create tables
sequelize.sync();

//setting relations between tables
db.User.hasMany(db.Contact, {
  foreignKey: "userId",
  target: "userId",
});
db.User.hasMany(db.Address, {
  foreignKey: "userId",
  target: "userId",
});
db.User.hasMany(db.Transaction, {
  foreignKey: "userId",
  target: "userId",
});

module.exports = db;
