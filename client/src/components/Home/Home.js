import React, { Component } from "react";
import wallet from "../../images/wallet.png";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "./Home.css";
import Chatbot from "../Chatbot/Chatbot";
import { FaFacebookMessenger, FaWallet } from "react-icons/fa";
import { Button } from "reactstrap";
import EthereumAddresses from "../Wallet/EthereumAddresses";
import Web3API from "../../config/web3Provider";

class Home extends Component {
  state = {
    isChatRoomVisible: false,
    totalBalance: 0,
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    address: PropTypes.object.isRequired,
  };

  setChatRoomVisibility = () => {
    this.setState({
      isChatRoomVisible: !this.state.isChatRoomVisible,
    });
  };

  getTotalBalance = (addresses) => {
    var totalEth = 0;
    var promises = [];

    for (let i = 0; i < addresses.length; i++) {
      promises.push(
        Web3API.eth
          .getBalance(addresses[i].hexValue)
          .then((res) => {
            let ethBalance = Web3API.utils.fromWei(res.toString(), "Ether");
            totalEth = totalEth + ethBalance;
          })
          .catch((err) => {
            console.log(err);
          })
      );
    }

    Promise.all(promises).then(() => {
      this.setState({
        totalBalance: Number(totalEth).toFixed(5),
      });
    });
  };

  render() {
    const { isAuthenticated } = this.props;

    return isAuthenticated ? (
      <div>
        <Button
        color="primary"
        size="sm"
        className="total-balance-btn"
        onClick={() => this.getTotalBalance(this.props.address.addresses)}
        >Get Total <FaWallet /></Button>
        <div className="total-balance" style={{ borderRadius: "9px" }}>
          Total balance: {this.state.totalBalance} ETH
        </div>
        <img
          className="wallpaper"
          alt="wallet"
          src={wallet}
          width="350rem"
          height="250rem"
        />
        <div className="wallet-section">
          <EthereumAddresses />
        </div>
        <div className="chat-section">
          <Button
            id="chat-bubble"
            onClick={this.setChatRoomVisibility}
            color="primary"
          >
            <FaFacebookMessenger />
          </Button>
          <Chatbot show={this.state.isChatRoomVisible} />
        </div>
      </div>
    ) : (
      <div>
        <div className="guest-message">
          Please <a href="/login">login</a> or <a href="/signup">register</a> to
          enjoy the Crypto-AI experience!
        </div>
        <img
          className="wallpaper"
          alt="wallet"
          src={wallet}
          width="350rem"
          height="250rem"
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
  address: state.address,
});

export default connect(mapStateToProps, null)(Home);
