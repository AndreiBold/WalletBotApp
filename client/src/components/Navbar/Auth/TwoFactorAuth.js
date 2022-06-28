import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { generateSecret } from "../../../actions/userActions";
import { clearErrors } from "../../../actions/errorActions";

class TwoFactorAuth extends Component {
  state = {
    token: "",
    // hashedSecret: "",
    msg: null,
  };

  static propTypes = {
    isTwoFactorAuthEnabled: PropTypes.bool,
    error: PropTypes.object.isRequired,
    generateSecret: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
  };

  render() {
    return <div>Second step of auth</div>;
  }
}

const mapStateToProps = (state) => ({
  error: state.error,
});

export default connect(mapStateToProps, { generateSecret, clearErrors })(TwoFactorAuth);
