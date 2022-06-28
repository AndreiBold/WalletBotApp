const fs = require("fs");

//mapping each router file (except index.js) to it's keyname
fs.readdirSync(__dirname).forEach((file) => {
  if (file !== "index.js") {
    let keyName = file.split(".")[0].split("-")[0];
    let moduleName = file.split(".")[0];
    exports[keyName] = require("./" + moduleName);
  }
});
