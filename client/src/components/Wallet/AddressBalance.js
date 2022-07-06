import React, { Component } from "react";
import Web3API from "../../config/web3Provider";

class AddressBalance extends Component {
  state = {
    balance: "",
  };

    componentDidMount() {
      this.getAccountBalance(this.props.hexAddress);
    }

  getAccountBalance = async (hexAddress) => {
    const balance = await Web3API.eth.getBalance(hexAddress); //return in wei
    const ethBalance = Web3API.utils.fromWei(
      balance.toString(),
      "Ether"
    );

    this.setState({
      balance: Number(ethBalance).toFixed(5),
    });
  };

  render() {
    return (
      <div>
        <span>{this.state.balance} ETH</span>
      </div>
    );
  }
}

export default AddressBalance;
