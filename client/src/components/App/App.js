import React, { Component } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { connect } from "react-redux";
import SignUp from "../Navbar/Auth/SignUp";
import LogIn from "../Navbar/Auth/LogIn";
import LogOut from "../Navbar/Auth/LogOut";
import "bootstrap/dist/css/bootstrap.min.css";
import { loadUser } from "../../actions/userActions";
import store from "../../stores/store";
import Home from "../Home";
import Account from "../Account";
import Friends from "../Friends";
import TwoFactorAuth from "../Navbar/Auth/TwoFactorAuth";
import Navbar from "../Navbar/Navbar";

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/logout" element={<LogOut />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/account" element={<Account />} />
              <Route path="/verify" element={<TwoFactorAuth />} />
            </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(null, null)(App);
