import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { loadUser } from "../../actions/userActions";
import { Card } from "reactstrap";
import { FaCheckCircle, FaTimesCircle, FaUserCircle } from "react-icons/fa";
import "./Account.css";

class Account extends Component {
  static propTypes = {
    userData: PropTypes.object,
    loadUser: PropTypes.func,
  };

  componentDidMount() {
    this.props.loadUser();
    console.log(this.props.userData);
  }

  render() {
    const { userName, email, isTwoFactorAuthEnabled } = this.props.userData;
    return (
      <Card className="account-details">
        <h3>
          <FaUserCircle /> My Account Details
        </h3>
        <div className="user-data-section">
          <div className="user-data">
            <span className="user-data-label">Username: </span>
            <span className="user-data-value">{userName}</span>
          </div>
          <div className="user-data">
            <span className="user-data-label">Email Address: </span>
            <span className="user-data-value">{email}</span>
          </div>
          <div className="user-data">
            <span className="user-data-label">Number of Friends: </span>
            <span className="user-data-value">3</span>
          </div>
          <div className="user-data">
            <span className="user-data-label">Two Factor Auth: </span>
            <span className="user-data-value">
              {isTwoFactorAuthEnabled ? <FaCheckCircle /> : <FaTimesCircle />}
            </span>
          </div>
        </div>
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  userData: state.user.userData,
});

export default connect(mapStateToProps, { loadUser })(Account);
