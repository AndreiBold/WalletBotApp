const express = require("express");
const router = express.Router();
const models = require("../models");
const auth = require("../middleware/auth");
const web3 = require("web3");

// @route  POST contacts/add
// @desc   Add a contact to your agenda
// @access Private
router.post("/add", auth, async (req, res) => {
  try {
    const reqBody = req.body;
    //check valid request
    if (!reqBody.contactName || !reqBody.hexAddress)
      throw Error("Please enter all fields");

    if (!web3.utils.isAddress(reqBody.hexAddress))
      throw Error("This is not a valid Ethereum address");

    //check if user exists
    const user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");

    //check if contact name is already in user's agenda
    const takenNameContact = await models.Contact.findOne({
      where: {
        userId: user.userId,
        contactName: reqBody.contactName,
      },
    });

    if (takenNameContact)
      throw Error("This contact name is already in your agenda");

    //check if ethereum address is already in user's agenda
    const takenHexAddressContact = await models.Contact.findOne({
      where: {
        userId: user.userId,
        hexAddress: reqBody.hexAddress,
      },
    });

    if (takenHexAddressContact)
      throw Error("This ethereum address is already in your agenda");

    //create new contact
    let newContact = await models.Contact.create({
      contactName: reqBody.contactName,
      hexAddress: reqBody.hexAddress,
      userId: user.userId,
    });

    res.status(201).json({ message: "Contact added successfully", newContact });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  DELETE contacts/remove/:contactId
// @desc   Remove a contact from your agenda
// @access Private
router.delete("/remove/:contactId", auth, async (req, res) => {
  try {
    //check if user exists
    const user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");

    //check if contact exists
    const contact = await models.Contact.findByPk(req.params.contactId);
    if (!contact) throw Error("Friend not found");

    //remove contact
    await contact.destroy({
      where: {
        contactId: req.params.contactId,
        userId: user.userId,
      },
    });

    res.status(201).json({
      message: "Contact removed successfully",
      contactId: req.params.contactId,
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  GET contacts/
// @desc   Get all contacts from your agenda
// @access Private
router.get("/", auth, async (req, res) => {
  try {
    //check if user exists
    const user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");

    // get all user's contacts
    const contacts = await models.Contact.findAll({
      where: {
        userId: user.userId,
      },
    });

    res.status(201).json({ contacts });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  GET contacts/:name
// @desc   Get contact's name by providing its hexValue
// @access Private
router.get("/:name", auth, async (req, res) => {
  try {
    //check if user exists
    const user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");

    // get desired contact
    const contact = await models.Contact.findOne({
      where: {
        contactName: req.params.name,
        userId: user.userId,
      },
    });

    // var contactName = "";

    // if (contact.contactName) {
    //   contactName = contact.contactName;
    // } 

    res.status(201).json({ contactAgendaAddress: contact.hexAddress });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;
