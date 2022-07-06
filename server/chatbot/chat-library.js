const { dockStart } = require("@nlpjs/basic");

const trainChatbot = async () => {
    const dock = await dockStart({ use: ["Basic"] });
    const nlp = dock.get("nlp");
    await nlp.addCorpus("../chatbot/corpus.json");
    await nlp.train();
  
    return nlp;
};

const transactionDetails = (res, context) => {
    var state = res.intent;
    var receiverAddress = "";
    var etherAmount = "";
    try {
        switch(state) {
            case "action.transaction":
                var isTransaction = res.utterance.includes("transaction") || res.utterance.includes("payment") ? true : false;
                if(isTransaction) {
                    return {
                        response: res.answer,
                        context: {
                            state: "transaction.receiverAddress"
                        }
                    }
                } else {
                    return {
                        response: "I can only help you make secure transactions",
                        context: context
                    }
                }
            case "transaction.receiverAddress":
                var isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(res.utterance) ? true : false;
                if(isValidAddress) {
                    receiverAddress = res.utterance.match(/^0x[a-fA-F0-9]{40}$/)[0];
                    return {
                        response: res.answer,
                        context: {
                            state: "transaction.etherAmount",
                            receiverAddress: receiverAddress
                        }
                    }
                } else {
                    return {
                        response: "Please give me a valid address",
                        context: context
                    }
                }
            case "transaction.etherAmount":
                etherAmount =  res.utterance.match(/[\d\.]+/)[0];
                console.log('ANSWER: ', res.answer);
                console.log('AMOUNT: ', etherAmount);
                console.log('RECEIVER: ', receiverAddress);
                if(etherAmount && parseFloat(etherAmount) > 0) {
                    receiverAddress = context.receiverAddress;
                    return {
                        response: res.answer + " Sent " + etherAmount + " Ether to address " + receiverAddress,
                        context: {...context, etherAmount: etherAmount}
                    }
                } else {
                    return {
                        response: 'Please provide a valid amount of Ether',
                        context: context
                    }
                }
        }
    } catch (err) {
        console.warn(err.stack);
    }
    
}

const processChat = async (message, context, nlpManager, user) => {

    const res = await nlpManager.process("en", message);


    if(res && res.intent) {
        if(res.intent === "greetings.hello" || res.intent === "greetings.bye" || res.intent === "feedback.thank" || res.intent.includes("faq")) {
            return {
                response: res.answer,
                context: res.intent
            }
        } else if(res.intent === 'None') {
             return {
                response: "Say that again, will you?",
                context: context
             }
        } else {
            return transactionDetails(res, context);
        }
    } else {
        return {
            response: "Something went wrong. I'll call my dev to solve this",
            context: context
        }
    }
}

module.exports = {
    trainChatbot,
    processChat
}
