const express = require("express");
const router = express.Router();
const models = require("../models");
const auth = require("../middleware/auth");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// @route  POST transactions/send
// @desc   Send a transaction from one user to another
// @access Private
router.post("/send", auth, async (req, res) => {
  try {
    const reqBody = req.body;
    //check valid request
    if (!reqBody.from || !reqBody.to || !reqBody.amount || !reqBody.hashLink)
      throw Error("Please enter all fields");

    //check if user exists
    const user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");

    //add new transaction to address history
    let newTransaction = await models.Transaction.create({
      from: reqBody.from,
      to: reqBody.to,
      amount: reqBody.amount,
      hashLink: reqBody.hashLink,
      timestamp: formatDate(new Date()),
      userId: user.userId,
    });

    res
      .status(201)
      .json({ message: "Transaction successfully sent", newTransaction });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  GET transactions/
// @desc   Get all transactions for an user
// @access Private
router.get("/", auth, async (req, res) => {
  try {
    //check if user exists
    const user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");

    // get all user's addresses
    const transactions = await models.Transaction.findAll({
      where: {
        userId: user.userId,
      },
    });

    res.status(201).json({ transactions });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  GET transactions/:hexValue
// @desc   Get all transactions for an user per his Ethereum address
// @access Private
router.get("/:hexValue", auth, async (req, res) => {
  try {
    //check if user exists
    const user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");

    // get all transactions for the Ethereum address (both sent and received)
    var transactions = await models.Transaction.findAll({
      where: {
        [Op.or]: [{ from: req.params.hexValue }, { to: req.params.hexValue }],
      },
    });

    const contacts = await models.Contact.findAll({
      where: {
        userId: user.userId,
      },
    });

    for (let i = 0; i < transactions.length; i++) {
      // console.log(transactions[i]);
      for (let j = 0; j < contacts.length; j++) {
        // console.log(contacts[j]);
        if (
          transactions[i].dataValues.from.toLowerCase() ===
            contacts[j].dataValues.hexAddress.toLowerCase() ||
          transactions[i].dataValues.to.toLowerCase() ===
            contacts[j].dataValues.hexAddress.toLowerCase()
        ) {
          transactions[i].dataValues.name = contacts[j].dataValues.contactName;
        }
      }
      if (!transactions[i].dataValues.name) {
        transactions[i].dataValues.name = "";
      }
    }

    res.status(201).json({ transactions });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

function formatDate(today) {
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  var hour = today.getHours() < 10 ? "0" + today.getHours() : today.getHours();
  var min =
    today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
  var sec =
    today.getSeconds() < 10 ? "0" + today.getSeconds() : today.getSeconds();

  today = dd + "/" + mm + "/" + yyyy + " at " + hour + ":" + min + ":" + sec;
  return today;
}

module.exports = router;
