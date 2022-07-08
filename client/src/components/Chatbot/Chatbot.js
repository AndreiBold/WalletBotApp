import React, { Component } from "react";
import { connect } from "react-redux";
import { Input, Button } from "reactstrap";
import PropTypes from "prop-types";
import { animateScroll } from "react-scroll";
import boi from "../../images/boi.png";
import coinbot from "../../images/coinbot.png";
import { userMessage, botMessage } from "../../actions/chatActions";
import { addAddress } from "../../actions/addressActions";
import { sendTransaction } from "../../actions/transactionActions";
import { getContact } from "../../actions/contactActions";
import "./Chatbot.css";
import { FaEthereum, FaLock, FaFileUpload } from "react-icons/fa";
import Web3API from "../../config/web3Provider";
import CRYPTOJS from "crypto-js";

class Chatbot extends Component {
  state = {
    message: "",
    ctx: {},
  };

  static propTypes = {
    userMessage: PropTypes.func.isRequired,
    botMessage: PropTypes.func.isRequired,
    messages: PropTypes.array.isRequired,
    response: PropTypes.object.isRequired,
    addAddress: PropTypes.func,
    sendTransaction: PropTypes.func,
    getContact: PropTypes.func,
    contact: PropTypes.object.isRequired,
  };

  handleChange = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  };

  componentDidMount() {
    this.scrollToBottom();
    console.log("userHexAddress: " + this.props.userHexAddress);
  }
  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentWillUnmount() {
    localStorage.removeItem("ref");
  }

  scrollToBottom() {
    animateScroll.scrollToBottom({
      containerId: "historyContainer",
    });
  }

  send = async () => {
    let ctx = {};

    await this.props.userMessage(this.state.message);

    await this.props.botMessage({
      context: this.state.ctx,
      message: this.state.message,
    });

    ctx = this.props.response.context;
    this.setState({ ctx: ctx });

    if (this.props.response.context.masterPin) {
      var addressValue = this.createEthereumAccount().address;
      var addressName = this.props.response.context.addressName;
      await this.props.addAddress({
        hexValue: addressValue,
        name: addressName,
      });
    }

    if (
      this.props.response.context.etherAmount &&
      this.props.response.context.receiverName
    ) {
      this.props.getContact(this.props.response.context.receiverName);
      console.log("YMCA: " + this.props.contact.contactAddress);
      await this.transferEther(
        this.props.contact.contactAddress,
        this.props.response.context.etherAmount
      );
    }

    if (this.props.response.context.hack) {
      await this.props.sendTransaction({
        from: this.props.userHexAddress,
        to: this.props.contact.contactAddress,
        amount: this.props.response.context.etherAmount,
        hashLink: localStorage.getItem("ref"),
      });
    }

    // this.props.sendTransaction(
    //   this.props.userHexAddress,
    //   this.props.contact.contactAddress,
    //   transferAmount,
    //   ref
    // );

    this.clearState();
    // this.createEthereumAccount();
    // var encPrivKey = this.encryptPrivateKey("123456");
    // this.decryptPrivateKey("123456", encPrivKey);
  };

  clearState = () => {
    this.setState({
      message: "",
    });
  };

  createEthereumAccount() {
    var account = Web3API.eth.accounts.create();
    //  console.log(`ethereum address: ${account.address}`);
    console.log(`plain privateKey: ${account.privateKey}`);
    this.encryptPrivateKey("123456", account);

    return account;
  }

  encryptPrivateKey(masterPin, account) {
    var secretKey = masterPin + process.env.REACT_SECRET_KEY;

    var cipher = CRYPTOJS.AES.encrypt(account.privateKey, secretKey).toString();
    localStorage.setItem(account.address, account.privateKey);
    //  console.log('encrypted: ' + cipher);
        //  var hashedPin = CRYPTOJS.SHA256(masterPin).toString();
    //  console.log('hash ' + hashedPin);
    //  var iv = hashedPin.substring(0, 16);
    //  var secretKey = hashedPin.substring(hashedPin.length - 32);
    //  console.log('iv: ' + iv);
    //  console.log('secret key: ' + secretKey);

    //  var cipher = CRYPTOJS.AES.encrypt(plainData, secretKey, {
    //   iv,
    //   padding: CRYPTOJS.pad.Pkcs7,
    //   mode: CRYPTOJS.mode.CBC
    //  })
    //  console.log('cipher: ' + cipher);
    //  console.log('cipher to string: ' + cipher.toString());
    return cipher;
  }

  decryptPrivateKey(masterPin, cipher) {
    var secretKey = masterPin + process.env.REACT_SECRET_KEY;
    var dataBytes = CRYPTOJS.AES.decrypt(cipher, secretKey);
    return dataBytes.toString(CRYPTOJS.enc.Utf8);
    // console.log('decrypted: ' + decryptedPrivKey);
  }

  transferEther = async (receiverAddress, transferAmount) => {
    //get nonce
    var nonce = await Web3API.eth.getTransactionCount(
      this.props.userHexAddress,
      "latest"
    );

    //convert wei to ether
    const value = Web3API.utils.toWei(transferAmount.toString(), "Ether");

    const block = Web3API.eth.getBlock("latest");
    console.log("block: ", block);
    const gasLimit = block.gasLimit;
    console.log("gas limit: ", gasLimit);

    let gasPrice;
    Web3API.eth.getGasPrice().then((res) => {
      console.log("PRET GAZ SIMPLU IN WEI: ", res);
      gasPrice = Number(res) * 1.6;
      console.log("PRET GAZ CRESCUT IN WEI: ", gasPrice);
    });

    const transaction = {
      from: this.props.userHexAddress,
      to: receiverAddress,
      value: value,
      gas: 55000,
      gasLimit: gasLimit, //changed after EIP-1559 upgrade
      gasPrice: gasPrice,
      nonce: nonce + 9,
    };

    // var privKey = this.decryptPrivateKey(
    //   "123456",
    //   localStorage.getItem(this.props.userHexAddress)
    // );

    //create signed transaction
    const signTrx = await Web3API.eth.accounts.signTransaction(
      transaction,
      "0xaa8dbe17940c010040973bc0c1b886d263bdf766cfc41d1ed1bbc12f2ebc30d0"
    );

    //send signed transaction to blockchain
    var ref;
    Web3API.eth.sendSignedTransaction(
      signTrx.rawTransaction,
      function (error, hash) {
        if (error) {
          console.log("Something went wrong", error);
        } else {
          ref = "https://ropsten.etherscan.io/tx/" + hash;
          localStorage.setItem("ref", ref);
          console.log("transaction submited ", hash);
          window.alert("Transaction submitted. Hash : " + hash);
        }
      }
    );
  };

  render() {
    return (
      this.props.show && (
        <div id="chat">
          <div className="conv-head">
            <img className="conv-icon" alt="bot" src={coinbot} />
            <h4 className="conv-title">
              Wally - Your WalletBot <FaEthereum />
            </h4>
            <span className="conv-info">
              End-To-End Encrypted Channel <FaLock />
            </span>
          </div>
          <hr className="delimiter"></hr>
          <div id="historyContainer">
            {this.props.messages.length === 0
              ? ""
              : this.props.messages.map((msg, index) => (
                  <div key={index} className={msg.type}>
                    {msg.type === "bot" ? (
                      <div>
                        <img className="chat-icon" alt="bot" src={coinbot} />
                        <div>{msg.message.response}</div>
                      </div>
                    ) : (
                      <div>
                        <img className="chat-icon" alt="user" src={boi} />
                        <div>{msg.message}</div>
                      </div>
                    )}
                  </div>
                ))}
          </div>
          <Input
            type="text"
            name="message"
            id="message"
            placeholder="Text Message"
            onChange={this.handleChange}
            value={this.state.message}
            style={{ width: "328px", marginLeft: "20px" }}
          />
          <Button
            color="success"
            size="sm"
            id="send-msg"
            onClick={() => this.send()}
            style={{
              marginLeft: "360px",
              marginTop: "-67px",
              height: "2.2rem",
              marginRight: "0.5rem",
            }}
          >
            Send
          </Button>
        </div>
      )
    );
  }
}

const mapStateToProps = (state) => ({
  error: state.error,
  response: state.chat.response,
  messages: state.chat.messages,
  contact: state.contact,
});

export default connect(mapStateToProps, {
  userMessage,
  botMessage,
  addAddress,
  sendTransaction,
  getContact,
})(Chatbot);
