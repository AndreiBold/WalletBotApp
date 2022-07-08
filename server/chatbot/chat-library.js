const { dockStart } = require("@nlpjs/basic");

const trainChatbot = async () => {
  const dock = await dockStart({ use: ["Basic"] });
  const nlp = dock.get("nlp");
  await nlp.addCorpus("./chatbot/corpus.json");
  await nlp.train();

  return nlp;
};

const cryptoActions = (res, context) => {
  var state = res.intent;
  try {
    switch (state) {
      case "create.address":
        var isCreate =
          res.utterance.includes("create") ||
          res.utterance.includes("new") ||
          res.utterance.includes("wallet")
            ? true
            : false;
        if (isCreate) {
          console.log("creaza wallet");
          return {
            response: res.answer,
            context: {
              state: "address.name",
            },
          };
        } else {
          return {
            response: "I can only help you create ethereum accounts",
            context: context,
          };
        }
      case "address.name":
        var isValidAddressName = res.utterance.includes("Account")
          ? true
          : false;
        if (isValidAddressName) {
          return {
            response: res.answer,
            context: {
              state: "secret.masterPin",
              addressName: res.utterance,
            },
          };
        } else {
          return {
            response: "Please give your account a valid name",
            context: context,
          };
        }
      case "secret.masterPin":
        var isValidPin = res.utterance.length == 6 ? true : false;
        if (isValidPin) {
          return {
            response: res.answer,
            context: { ...context, masterPin: res.utterance },
          };
        } else {
          return {
            response: "Please give me a 6 digit master pin",
            context: context,
          };
        }
      case "send.ether":
        var isTransaction =
          res.utterance.includes("send") ||
          res.utterance.includes("transaction") ||
          res.utterance.includes("payment")
            ? true
            : false;
        if (isTransaction) {
          return {
            response: res.answer,
            context: {
              state: "receiver.name",
            },
          };
        } else {
          return {
            response: "I can only help you send ethers",
            context: context,
          };
        }
      case "receiver.name":
        var isValidReceiverName =
          res.utterance && res.utterance !== "" ? true : false;
        if (isValidReceiverName) {
          return {
            response: res.answer,
            context: {
              state: "ether.amount",
              receiverName: res.utterance,
            },
          };
        } else {
          return {
            response: "Please give me a valid contact name",
            context: context,
          };
        }
      case "ether.amount":
        if (res.utterance && parseFloat(res.utterance) > 0) {
          return {
            response:
              res.answer +
              " Sent " +
              res.utterance +
              " ETH to " +
              context.receiverName,
            context: { ...context, etherAmount: res.utterance, state: "hack" },
          };
        } else {
          return {
            response: "Please provide a positive amount of ether",
            context: context
          }
        }
      case "hack":
        return {
          response: res.answer,
          context: {...context, hack: true}
        }
    }
  } catch (err) {
    console.warn(err.stack);
  }
};

const processChat = async (message, context, nlpManager, user) => {
  const res = await nlpManager.process("en", message);

  if (res && res.intent) {
    if (
      res.intent === "open" ||
      res.intent === "close" ||
      res.intent === "thank" ||
      res.intent.includes("faq")
    ) {
      return {
        response: res.answer + ", " + user.userName,
        context: res.intent,
      };
    } else if (res.intent === "None") {
      return {
        response: "Say that again, will you?",
        context: context,
      };
    } else {
      return cryptoActions(res, context);
    }
  } else {
    return {
      response: "Something went wrong. I'll call my dev to solve this",
      context: context,
    };
  }
};

module.exports = {
  trainChatbot,
  processChat,
};
