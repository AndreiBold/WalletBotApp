import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import LogOut from "./Auth/LogOut";
import coinbot from "../../images/coinbot.png";
import "./Navbar.css";
import {
  FaSignInAlt,
  FaHome,
  FaRegUser,
  FaUserCircle,
  FaUsers,
} from "react-icons/fa";
import { Button } from "reactstrap";
import { generateSecret } from "../../actions/userActions";
import { clearErrors } from "../../actions/errorActions";
 
class Navbar extends Component {
  componentDidUpdate(prevProps) {
    const { messageUserSecret } = this.props;

    if (
      messageUserSecret !== prevProps.messageUserSecret &&
      messageUserSecret === "Secret generated successfully!"
    ) {
      window.location.replace("/verify");
      console.log('GOOD');
    } else {
      console.log("HELP");
    }
  }

  static propTypes = {
    user: PropTypes.object.isRequired,
    generateSecret: PropTypes.func.isRequired,
    messageUserSecret: PropTypes.string,
    clearErrors: PropTypes.func.isRequired
  };

  enableTwoFactAuth = () => {
    this.props.generateSecret();
    console.log("generate secret");
  };

  render() {
    const { isAuthenticated, userData } = this.props.user;

    const authLinks = (
      <Fragment>
        <ul className="navbar-nav mr-auto">
          <li className="nav-item mr-3">
            <Link to="/" className="nav-link text-white">
              <FaHome /> Home
            </Link>
          </li>
          <li className="nav-item mr-3">
            <Link to="/friends" className="nav-link text-white">
              <FaUsers /> Friends
            </Link>
          </li>
          <li className="nav-item mr-3">
            <Link to="/account" className="nav-link text-white">
              <FaUserCircle /> Account
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <span className="navbar-text mr-3">
            <strong>
              {isAuthenticated && userData
                ? `Welcome ${userData.userName}!`
                : ""}
            </strong>
          </span>
          {userData && !userData.isTwoFactorAuthEnabled ? (<li className="nav-item mr-3">
            <Button onClick={() => this.enableTwoFactAuth()}>
              Enable 2FA
            </Button>
          </li>) : null}
          <li className="nav-item mr-3">
            <LogOut />
          </li>
        </ul>
      </Fragment>
    );

    const guestLinks = (
      <Fragment>
        <ul className="navbar-nav mr-auto">
          <li className="nav-item mr-3">
            <Link to="/" className="nav-link text-white">
              <FaHome /> Home
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item mr-3">
            <Link to="/signup" className="nav-link text-white">
              <FaRegUser /> SignUp
            </Link>
          </li>
          <li className="nav-item mr-3">
            <Link to="/login" className="nav-link text-white">
              <FaSignInAlt /> LogIn
            </Link>
          </li>
        </ul>
      </Fragment>
    );

    return (
      <nav className="navbar navbar-expand-md navbar-dark">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="navbar-brand">
          <img alt="App brand" src={coinbot} width="50px" height="50px" />
        </div>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {isAuthenticated ? authLinks : guestLinks}
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  messageUserSecret: state.user.message
});

export default connect(mapStateToProps, {generateSecret, clearErrors})(Navbar);
