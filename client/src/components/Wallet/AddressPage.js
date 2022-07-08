import React, { Component } from "react";
import { Button } from "reactstrap";
import { connect } from "react-redux";
import { getAddress } from "../../actions/addressActions";
import PropTypes from "prop-types";
import "./EthereumAddresses.css";
import {
  FaEthereum,
  FaRocket,
  FaCopy,
  FaCoins,
  FaArrowLeft,
  FaFacebookMessenger
} from "react-icons/fa";
import Web3API from "../../config/web3Provider";
import "./AddressPage.css";
import Chatbot from "../Chatbot/Chatbot";
import Transactions from "./Transactions";

class AddressPage extends Component {
  state = {
    isCopied: false,
    isChatRoomVisible: false,
    balance: "",
  };

  static propTypes = {
    getAddress: PropTypes.func.isRequired,
    address: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
  };

  copyToClipboard = (hexAddress) => {
    navigator.clipboard.writeText(hexAddress);

    this.setState({
      isCopied: true,
    });
  };

  getAccountBalance = async (hexAddress) => {
    const balance = await Web3API.eth.getBalance(hexAddress); //return in wei
    const ethBalance = Web3API.utils.fromWei(balance.toString(), "Ether");

    this.setState({
      balance: Number(ethBalance).toFixed(5),
    });
  };

  backHome = () => {
    window.location.replace("/");
    localStorage.removeItem("eth-address");
  };

  setChatRoomVisibility = () => {
    this.setState({
      isChatRoomVisible: !this.state.isChatRoomVisible,
    });
  };

  componentDidMount() {
    this.props.getAddress(localStorage.getItem("eth-address"));
  }

  componentDidUpdate(prevState) {
    this.getAccountBalance(localStorage.getItem("eth-address"));

    if (
      this.state.isCopied != prevState.isCopied &&
      this.state.isCopied == true
    )
      setTimeout(() => {
        this.setState({
          isCopied: false,
        });
      }, 1500);
  }

  render() {
    const { isAuthenticated } = this.props;
    const { selectedAddress } = this.props.address;

    return isAuthenticated && selectedAddress != undefined ? (
      <div className="address-page-container">
        <Button
          color="dark"
          className="back-btn"
          onClick={() => this.backHome()}
        >
          <FaArrowLeft /> Back
        </Button>
        <div className="address-details-wrapper">
          <div className="address-details-section">
            <span>
              <FaRocket /> {selectedAddress.name}
            </span>
            <span>
              <FaEthereum />
              {selectedAddress.hexValue.slice(0, 10) +
                "..." +
                selectedAddress.hexValue.slice(-10)}
              <FaCopy
                className="copy-icon"
                onClick={this.copyToClipboard.bind(
                  this,
                  selectedAddress.hexValue
                )}
              />
              {this.state.isCopied ? "copied!" : null}
            </span>
          </div>
          <div className="balance-section">
            <span>
              <FaCoins /> {this.state.balance} ETH
            </span>
          </div>
        </div>
        <div className="chat-section">
          <Button
            id="chat-bubble"
            onClick={this.setChatRoomVisibility}
            color="primary"
          >
            <FaFacebookMessenger />
          </Button>
          <Chatbot show={this.state.isChatRoomVisible} userHexAddress={localStorage.getItem("eth-address")}/>
        </div>
        <div className="transactions-section">
          <Transactions hexAddress={selectedAddress.hexValue} addressName={selectedAddress.name} />
        </div>
      </div>
    ) : (
      <div className="guest-message">
        Please <a href="/login">login</a> in order to see the details and
        transactions for this address
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  address: state.address,
  isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps, { getAddress })(AddressPage);
