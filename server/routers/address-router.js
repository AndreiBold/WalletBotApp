const express = require("express");
const router = express.Router();
const models = require("../models");
const auth = require("../middleware/auth");

// @route  POST addresses/add
// @desc   Add an ethreum address to wallet
// @access Private
router.post("/add", auth, async (req, res) => {
  try {
    const reqBody = req.body;
    //check valid request
    if (!reqBody.name || !reqBody.hexValue)
      throw Error("Please enter all fields");

    //check if user exists
    const user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");

    //check if address name is already in user's wallet
    const takenNameAddress = await models.Address.findOne({
      where: {
        userId: user.userId,
        name: reqBody.name,
      },
    });

    if (takenNameAddress)
      throw Error("This address name is already in your wallet");

    //add new address to wallet
    let newAddress = await models.Address.create({
      hexValue: reqBody.hexValue,
      name: reqBody.name,
      userId: user.userId,
    });

    res
      .status(201)
      .json({ message: "Ethereum address created successfully", newAddress });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  DELETE addresses/remove/:hexValue
// @desc   Remove an ethereum address from wallet
// @access Private
router.delete("/remove/:hexValue", auth, async (req, res) => {
  try {
    //check if user exists
    const user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");

    //check if address exists
    const address = await models.Address.findByPk(req.params.hexValue);
    if (!address) throw Error("Ethereum address not found");

    //remove address
    await address.destroy({
      where: {
        hexValue: req.params.hexValue,
        userId: user.userId,
      },
    });

    res.status(201).json({
      message: "Address removed successfully",
      hexValue: req.params.hexValue,
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  GET addresses/
// @desc   Get all user's ethereum addresses
// @access Private
router.get("/", auth, async (req, res) => {
  try {
    //check if user exists
    const user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");

    // get all user's addresses
    const addresses = await models.Address.findAll({
      where: {
        userId: user.userId,
      },
    });

    res.status(201).json({ addresses });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  GET addresses/:hexValue
// @desc   Get one ethereum address from user's wallet
// @access Private
router.get("/:hexValue", auth, async (req, res) => {
  try {
    //check if user exists
    const user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");

    // get desired address
    const address = await models.Address.findOne({
      where: {
        hexValue: req.params.hexValue,
        userId: user.userId,
      },
    });

    if (!address) throw Error("Ethereum address not found");

    res.status(201).json({ address });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;
