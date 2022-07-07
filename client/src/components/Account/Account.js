import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { loadUser } from "../../actions/userActions";
import { getContacts } from "../../actions/contactActions";
import { Card } from "reactstrap";
import { FaCheckCircle, FaTimesCircle, FaUserCircle } from "react-icons/fa";
import "./Account.css";

class Account extends Component {
  static propTypes = {
    userData: PropTypes.object,
    loadUser: PropTypes.func,
    contact: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
    getContacts: PropTypes.func
  };

  componentDidMount() {
    this.props.loadUser();
    this.props.getContacts();
    console.log(this.props.userData);
    console.log(this.props.contact.contacts);
    console.log(this.props.isAuthenticated);
  }

  render() {
    const { userName, email, isTwoFactorAuthEnabled } = this.props.userData;
    const { contacts } = this.props.contact;
    const { isAuthenticated } = this.props;
    console.log("isAuth: " + isAuthenticated);
    return isAuthenticated ? (
      <Card className="account-details">
        <h3>
          <FaUserCircle /> My Account Details
        </h3>
        <hr></hr>
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
            <span className="user-data-label">Trusted Contacts: </span>
            <span className="user-data-value">{contacts.length}</span>
          </div>
          <div className="user-data">
            <span className="user-data-label">Two Factor Auth: </span>
            <span className="user-data-value">
              {isTwoFactorAuthEnabled ? <FaCheckCircle /> : <FaTimesCircle />}
            </span>
          </div>
        </div>
      </Card>
    ) : (
      <div className="guest-message">
        Please <a href="/login">login</a> in order to see your account details!
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userData: state.user.userData,
  contact: state.contact,
  isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps, { loadUser, getContacts })(Account);
