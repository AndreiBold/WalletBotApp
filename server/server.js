const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routers = require("./routers");

const app = express();
app.use(bodyParser.json());
app.use(cors({origin: "https://localhost:3000"}));

app.use("/users", routers.user);
app.use("/contacts", routers.contact);

const https = require("https");
const fs = require("fs");

const options = {
  key: fs.readFileSync("C:/Windows/System32/cert.key"),
  cert: fs.readFileSync("C:/Windows/System32/cert.crt"),
};

require("dotenv").config();
const PORT = process.env.PORT || 5000;

https
  .createServer(options, app)
  .listen(PORT, () => console.log(`Secure server started on port ${PORT}...`));
