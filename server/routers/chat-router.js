const express = require("express");
const router = express.Router();
const models = require("../models");
const chatLib = require("../chatbot/chat-library");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    let user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");

    let { message, context } = req.body;
    let manager = await chatLib.trainChatbot();
    let response = await chatLib.processChat(message, context, manager, user);

    console.log(response);
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({
      message: `${err}`,
    });
  }
});

module.exports = router;
