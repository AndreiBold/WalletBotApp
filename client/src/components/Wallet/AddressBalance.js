import React, { Component } from "react";
import Web3 from "web3/dist/web3.min.js";

class AddressBalance extends Component {
  state = {
    balance: "",
    web3: new Web3(
      new Web3.providers.HttpProvider(
        process.env.REACT_APP_INFURA_ROPSTEN_HTTP_URL
      )
    ),
  };

    componentDidMount() {
      this.getAccountBalance(this.props.hexAddress);
    }

  getAccountBalance = async (hexAddress) => {
    const balance = await this.state.web3.eth.getBalance(hexAddress); //return in wei
    const ethBalance = this.state.web3.utils.fromWei(
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
