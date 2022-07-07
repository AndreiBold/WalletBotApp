import React, { Component } from "react";
import { Container, ListGroup, ListGroupItem } from "reactstrap";
import { connect } from "react-redux";
import { getTransactions } from "../../actions/transactionActions";
import PropTypes from "prop-types";
import { GrTransaction } from "react-icons/gr";
import "./Transactions.css";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";

class Transactions extends Component {
  static propTypes = {
    getTransactions: PropTypes.func.isRequired,
    transaction: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.getTransactions(this.props.hexAddress);
  }

  render() {
    const { transactions } = this.props.transaction;

    return transactions.length > 0 ? (
      <div className="address-transactions-wrapper">
        <h3 className="transactions-title">
          Transactions History for this address <GrTransaction />
        </h3>
        <Container className="address-transactions-section">
          <ListGroup className="transactions-list">
            {transactions.map(
              ({ txId, from, to, amount, hashLink, timestamp, name }) => (
                <ListGroupItem key={txId} className="transaction-info">
                  <div className="info-container">
                    {from.toLowerCase() !==
                    this.props.hexAddress.toLowerCase() ? (
                      <span>
                        <GiReceiveMoney className="receive" />
                        From: {name !== "" ? name : from.slice(0, 10) + "..." + from.slice(-10)}
                      </span>
                    ) : (
                      <span>
                        <GiPayMoney className="send" />
                        To: {name !== "" ? name : to.slice(0, 10) + "..." + to.slice(-10)}
                      </span>
                    )}
                    <span>Amount: {amount} ETH</span>
                    <span><a href={hashLink} target="_blank">Block explorer</a></span>
                    <span>On: {timestamp}</span>
                  </div>
                </ListGroupItem>
              )
            )}
          </ListGroup>
        </Container>
      </div>
    ) : (
      <div className="empty-transactions-section">
        There are no transactions for this address at the moment
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  transaction: state.transaction,
});

export default connect(mapStateToProps, { getTransactions })(
  Transactions
);
