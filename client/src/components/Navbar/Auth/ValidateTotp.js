import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { validate } from "../../../actions/userActions";
import { clearErrors } from "../../../actions/errorActions";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from "reactstrap";
import "./ValidateTotp.css";

class TwoFactorAuth extends Component {
  state = {
    token: "",
    msg: null,
  };

  static propTypes = {
    error: PropTypes.object.isRequired,
    validate: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    isTwoFactorEnabled: PropTypes.bool
  };

  componentDidUpdate(prevProps) {
    const { isTwoFactorEnabled, error } = this.props;
    if (error !== prevProps.error) {
      // Check for validate error
      if (error.id === "VALIDATE_FAIL") {
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

    const body = {
      token,
    };

    // Attempt to validate
    this.props.validate(body);

    this.setState({
      token: "",
    });
  };

  render() {
    return (
      <div className="validate-container">
            {this.state.msg ? (
              <Alert color="danger">{this.state.msg}</Alert>
            ) : null}
            <h3>Validate Totp Token</h3>

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
                  className="validate-btn"
                >
                  Validate
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

export default connect(mapStateToProps, { validate, clearErrors })(TwoFactorAuth);