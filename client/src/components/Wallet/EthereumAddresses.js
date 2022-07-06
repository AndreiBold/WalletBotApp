import React, { Component } from "react";
import { Container, ListGroup, ListGroupItem } from "reactstrap";
import { connect } from "react-redux";
import { getAddresses } from "../../actions/addressActions";
import PropTypes from "prop-types";
import "./EthereumAddresses.css";
import { FaEthereum, FaRocket, FaCopy, FaWallet } from "react-icons/fa";
import AddressBalance from "./AddressBalance";

class EthereumAddresses extends Component {
  state = {
    isCopied: false,
    selectedHexValue: "",
  };

  static propTypes = {
    getAddresses: PropTypes.func.isRequired,
    address: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.getAddresses();
  }

  componentDidUpdate(prevState) {
    if (
      this.state.isCopied != prevState.isCopied &&
      this.state.isCopied == true
    )
      setTimeout(() => {
        this.setState({
          isCopied: false,
          selectedHexValue: "",
        });
      }, 1500);
  }

  copyToClipboard = (hexAddress) => {
    navigator.clipboard.writeText(hexAddress);

    this.setState({
      isCopied: true,
      selectedHexValue: hexAddress,
    });
  };

  render() {
    const { addresses } = this.props.address;

    return addresses.length > 0 ? (
      <div className="wallet-addresses-wrapper">
        <h3 className="wallet-title">
          Your Ethereum Wallet Addresses <FaWallet />
        </h3>
        <Container className="wallet-addresses-section">
          <ListGroup className="address-list">
            {addresses.map(({ hexValue, name }) => (
              <ListGroupItem key={hexValue} className="address-info">
                <div className="info-container">
                  <span>
                    <FaRocket /> {name}
                  </span>
                  <span>
                    <FaEthereum />
                    {hexValue.slice(0, 10) + "..." + hexValue.slice(-10)}
                    <FaCopy
                      className="copy-icon"
                      onClick={this.copyToClipboard.bind(this, hexValue)}
                    />
                    {this.state.isCopied &&
                    this.state.selectedHexValue == hexValue
                      ? "copied!"
                      : null}
                  </span>
                </div>
                <div className="balance-wrapper">
                  <AddressBalance hexAddress={hexValue} />
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        </Container>
      </div>
    ) : (
      <div className="empty-wallet-section">
        Your wallet is empty. Ask Wally to create some Ethereum addresses for
        you
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  address: state.address,
});

export default connect(mapStateToProps, { getAddresses })(EthereumAddresses);
