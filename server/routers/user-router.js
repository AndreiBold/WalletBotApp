const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const models = require("../models");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const JWT_SECRET = process.env.JWT_SECRET;
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

var plainSecretInstance;

// @route  POST users/
// @desc   Register new user
// @access Public
router.post("/", async (req, res) => {
  let reqBody = req.body;

  // check valid request
  if (!reqBody.userName || !reqBody.password || !reqBody.email) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    // check for existing user
    let user = await models.User.findOne({
      where: { email: reqBody.email },
    });

    if (user) throw Error("User already exists");

    // check if the password is valid
    let testRegexPass =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!testRegexPass.test(reqBody.password)) {
      throw Error(
        "Please enter a password containing at least one lower case, one upper case, one digit and min 8 characters"
      );
    }

    // hash the password
    reqBody.password = await bcrypt.hash(reqBody.password, 15);
    if (!reqBody.password)
      throw Error("Something went wrong hashing the password");

    // create user
    let newUser = await models.User.create(reqBody);

    //getting userdata
    let userData = await models.User.findOne({
      where: { userId: newUser.userId },
      attributes: ["userId", "userName", "email", "isTwoFactorAuthEnabled"],
    });

    // generate token
    let token = jwt.sign({ userId: userData.userId }, JWT_SECRET, {
      expiresIn: 3600,
    });

    if (!token) throw Error("Couldn't sign the token");

    res.status(201).json({
      token,
      userData,
      message: "Registered successfully!",
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  POST users/login
// @desc   Login user
// @access Public
router.post("/login", async (req, res) => {
  let reqBody = req.body;

  //check valid request
  if (!reqBody.email || !reqBody.password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }
  try {
    // check for existing user
    let user = await models.User.findOne({
      where: { email: reqBody.email },
    });

    if (!user) throw Error("User not found");

    // check if the password is correct
    if (!(await bcrypt.compare(reqBody.password, user.password))) {
      throw Error("Invalid credentials");
    }

    //getting userdata
    let userData = await models.User.findOne({
      where: { userId: user.userId },
      attributes: ["userId", "userName", "email", "isTwoFactorAuthEnabled"],
    });

    // generate token
    let token = jwt.sign({ userId: userData.userId }, JWT_SECRET, {
      expiresIn: 3600,
    });
    if (!token) throw Error("Couldn't sign the token");

    res.status(201).json({
      token,
      userData,
      message: "Logged-in successfully!",
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  POST users/generateSecret
// @desc   Generate secret for auth step 2
// @access Private
router.post("/generateSecret", auth, async (req, res) => {
  try {
    //check if the desired user exists
    let user = await models.User.findOne({
      where: { userId: req.user.userId },
    });

    if (user == null) throw Error("User not found");

    let secret = speakeasy.generateSecret();
    qrcode.toDataURL(secret.otpauth_url, async (err, qrImage) => {
      if (!err) {
        let hashedSecret = await bcrypt.hash(getPlainSecret(secret.base32), 15);

        if (!hashedSecret)
          throw Error("Something went wrong hashing the secret");

        res.status(201).json({
          qr: qrImage,
          hashedSecret: hashedSecret,
          message: "Secret generated successfully!",
        });
      } else {
        throw Error("Could not generate the secret");
      }
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  POST users/verify
// @desc   Verify first time after user enabled two-factor auth if
//         authenticator app uses same secret as user secret to generate token
// @access Private
router.post("/verify", auth, async (req, res) => {
  try {
    //check if the desired user exists
    let user = await models.User.findOne({
      where: { userId: req.user.userId },
    });

    if (user == null) throw Error("User not found");

    const userToken = req.body.token;
    const hashedSecret = req.body.hashedSecret;

    if (!(await bcrypt.compare(plainSecretInstance, hashedSecret))) {
      throw Error("Invalid secret");
    }

    console.log("secretul in verify: ", plainSecretInstance);

    const verified = speakeasy.totp.verify({
      secret: plainSecretInstance,
      encoding: "base32",
      token: userToken,
    });
    if (verified) {
      user.update({ secretTotp: hashedSecret, isTwoFactorAuthEnabled: true });
      res.status(201).json({ verified: true });
    } else {
      res.status(201).json({ verified: false });
    }
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  POST users/validate
// @desc   Validate the token every time user logs in
// @access Private
router.post("/validate", auth, async (req, res) => {
  try {
    //check if the desired user exists
    let user = await models.User.findOne({
      where: { userId: req.user.userId },
    });

    if (user == null) throw Error("User not found");

    const userToken = req.body.token;
    const hashedSecret = user.secretTotp;

    if (!(await bcrypt.compare(plainSecretInstance, hashedSecret))) {
      throw Error("Invalid secret");
    }

    console.log("secretul in validate: ", plainSecretInstance);

    const validated = speakeasy.totp.verify({
      secret: plainSecretInstance,
      encoding: "base32",
      token: userToken,
    });
    if (validated) {
      res.status(201).json({ validated: true });
    } else {
      res.status(201).json({ validated: false });
    }
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  GET users/user
// @desc   Login user
// @access Private
router.get("/user", auth, async (req, res) => {
  try {
    //check if the desired user exists
    let user = await models.User.findOne({
      where: { userId: req.user.userId },
      attributes: ["userId", "userName", "email", "isTwoFactorAuthEnabled"],
    });

    if (user == null) throw Error("User not found");

    //get the user's info
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

function getPlainSecret(plainSecret) {
  if (!plainSecretInstance) {
    plainSecretInstance = plainSecret;
  }
  console.log("secretul in getPlainSecret: ", plainSecretInstance);
  return plainSecretInstance;
}

module.exports = router;
