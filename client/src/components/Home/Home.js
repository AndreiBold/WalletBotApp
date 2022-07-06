import React, { Component } from "react";
import wallet from "../../images/wallet.png";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "./Home.css";
import Chatbot from "../Chatbot/Chatbot";
import { FaFacebookMessenger } from "react-icons/fa";
import { Button } from "reactstrap";
import EthereumAddresses from "../Wallet/EthereumAddresses";

class Home extends Component {
  state = {
    isChatRoomVisible: false,
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
  };

  setChatRoomVisibility = () => {
    this.setState({
      isChatRoomVisible: !this.state.isChatRoomVisible,
    });
  };

  render() {
    const { isAuthenticated } = this.props;

    return isAuthenticated ? (
      <div>
        <div className="total-balance" style={{ borderRadius: "9px" }}>Total balance: 1.2345 ETH</div>
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
});

export default connect(mapStateToProps, null)(Home);
