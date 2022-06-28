import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../../actions/userActions";
import { clearErrors } from "../../../actions/errorActions";
import "./LogIn.css";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from "reactstrap";
import { FaSignInAlt } from "react-icons/fa";

class LogIn extends Component {
  state = {
    email: "",
    password: "",
    msg: null,
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
  };

  componentDidUpdate(prevProps) {
    const { error, isAuthenticated } = this.props;
    if (error !== prevProps.error) {
      // Check for login error
      if (error.id === "LOGIN_FAIL") {
        this.setState({ msg: error.msg.message });
      } else {
        this.setState({ msg: null });
      }
    }

    if (isAuthenticated !== prevProps.isAuthenticated && isAuthenticated) {
        this.props.history.push("/");
    }
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { email, password } = this.state;

    const user = {
      email,
      password,
    };

    // Attempt to login
    this.props.login(user);

    this.setState({
      email: "",
      password: "",
    });
  };

  render() {
    return (
      <div className="login-container">
            {this.state.msg ? (
              <Alert color="danger">{this.state.msg}</Alert>
            ) : null}
            <h3><FaSignInAlt/> Login</h3>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <Label for="email">Email Address</Label>
                <Input
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Email Address"
                  className="mb-3"
                  onChange={this.handleChange}
                  value={this.state.email}
                  style={{ margin: "0 auto", width: "70%" }}
                />

                <Label for="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className="mb-3"
                  onChange={this.handleChange}
                  value={this.state.password}
                  style={{ margin: "0 auto", width: "70%" }}
                />

                <Button
                  type="submit"
                  className="login-btn"
                >
                  Login
                </Button>
              </FormGroup>
            </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
  error: state.error,
});

export default connect(mapStateToProps, { login, clearErrors })(LogIn);