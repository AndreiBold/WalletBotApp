import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { verify } from "../../../actions/userActions";
import { clearErrors } from "../../../actions/errorActions";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from "reactstrap";
import "./TwoFactorAuth.css";

class TwoFactorAuth extends Component {
  state = {
    token: "",
    msg: null,
  };

  static propTypes = {
    error: PropTypes.object.isRequired,
    verify: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    isTwoFactorEnabled: PropTypes.bool,
  };

  componentDidUpdate(prevProps) {
    const { isTwoFactorEnabled, error } = this.props;
    if (error !== prevProps.error) {
      // Check for verify error
      if (error.id === "VERIFY_FAIL") {
        this.setState({ msg: error.msg.message });
      } else {
        this.setState({ msg: null });
      }
    }

    console.log('hhh: ' + isTwoFactorEnabled);

    if (isTwoFactorEnabled !== prevProps.isTwoFactorEnabled && isTwoFactorEnabled) {
      console.log("============");
        window.location.replace("/");
    }
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { token } = this.state;
    const secret = localStorage.getItem('secret');

    const body = {
      token,
      secret,
    };

    // Attempt to verify
    this.props.verify(body);

    this.setState({
      token: "",
    });
  };

  render() {
    return (
      <div className="verify-container">
            {this.state.msg ? (
              <Alert color="danger">{this.state.msg}</Alert>
            ) : null}
            <h3>Verify Totp Token</h3>
            <img src={localStorage.getItem('qrcode')}/>

            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <Label for="token">Totp Token</Label>
                <Input
                  type="text"
                  name="token"
                  id="token"
                  placeholder="Totp Token"
                  className="mb-3"
                  onChange={this.handleChange}
                  value={this.state.token}
                  style={{ margin: "0 auto", width: "70%" }}
                />

                <Button
                  type="submit"
                  className="verify-btn"
                >
                  Verify
                </Button>
              </FormGroup>
            </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isTwoFactorEnabled: state.user.isTwoFactorEnabled,
  error: state.error,
});

export default connect(mapStateToProps, { verify, clearErrors })(TwoFactorAuth);