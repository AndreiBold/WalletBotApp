import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { register } from "../../../actions/userActions";
import { clearErrors } from "../../../actions/errorActions";
import "./SignUp.css";
import { Button, Form, FormGroup, Label, Input, Alert } from "reactstrap";
import { FaRegUser } from "react-icons/fa";

class SignUp extends Component {
  state = {
    userName: "",
    email: "",
    password: "",
    msg: null,
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
  };

  componentDidUpdate(prevProps) {
    const { error, isAuthenticated } = this.props;
    
    if (error !== prevProps.error) {
      // Check for register error
      if (error.id === "REGISTER_FAIL") {
        this.setState({ msg: error.msg.message });
      } else {
        this.setState({ msg: null });
      }
    }

    if (isAuthenticated !== prevProps.isAuthenticated && isAuthenticated) {
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

    const { userName, email, password } = this.state;

    // Create user object
    const newUser = {
      userName,
      email,
      password,
    };

    // Attempt to register
    this.props.register(newUser);

    this.setState({
      userName: "",
      email: "",
      password: "",
    });
  };

  render() {
    return (
      <div className="signup-container">
        {this.state.msgError ? (
          <Alert color="danger">{this.state.msgError}</Alert>
        ) : null}
        <h3><FaRegUser /> Register</h3>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="userName">User Name</Label>
            <Input
              type="text"
              name="userName"
              id="userName"
              placeholder="User Name"
              className="mb-3"
              onChange={this.handleChange}
              value={this.state.userName}
              style={{ margin: "0 auto", width: "70%" }}
            />

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
              className="register-btn"
            >
              Register
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

export default connect(mapStateToProps, { register, clearErrors })(SignUp);
