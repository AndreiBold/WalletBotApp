const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function auth(req, res, next) {
  const token = req.header("x-auth-token");

  console.log('BACKEND: ' + token);

  //Check for token
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    //Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    //Add user from payload
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Token is not valid" });
  }
}

module.exports = auth;
