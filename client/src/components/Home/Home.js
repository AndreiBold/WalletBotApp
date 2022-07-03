import React, { Component } from "react";
import wallet from "../../images/wallet.png";

class Home extends Component {
  render() {
    return (
      <div>
        <div>Home sweet home!</div>
        <img alt="wallet" src={wallet} width="400rem" height="300rem" />
      </div>
    );
  }
}

export default Home;
