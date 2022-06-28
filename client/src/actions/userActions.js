import { returnErrors } from "./errorActions";
import axios from "axios";
import {
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGOUT_SUCCESS,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  GENERATE_SECRET_SUCCESS,
  GENERATE_SECRET_FAIL,
} from "./types";

// Check token & load user
export const loadUser = () => (dispatch, getState) => {
  // User loading
  dispatch({ type: USER_LOADING });

  axios
    .get("/users/user", tokenConfig(getState))
    .then((res) =>
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      })
    )
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR,
      });
    });
};

//Register User
export const register = ({ userName, email, password }) => (dispatch) => {
  //Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  //Request body
  const body = JSON.stringify({ userName, email, password });

  axios
    .post("/users/", body, config)
    .then((res) =>
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      })
    )
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "REGISTER_FAIL")
      );
      dispatch({
        type: REGISTER_FAIL,
      });
    });
};

// Login user
export const login = ({ email, password }) => (dispatch) => {
  //Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  //Request body
  const body = JSON.stringify({ email, password });

  axios
    .post("/users/login", body, config)
    .then((res) =>
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      })
    )
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "LOGIN_FAIL")
      );
      dispatch({
        type: LOGIN_FAIL,
      });
    });
};

// Generate secret for second auth factor
export const generateSecret = () => (dispatch, getState) => {
  console.log('STATE: ', getState);
  axios
    .post("/users/generateSecret", {}, tokenConfig(getState))
    .then((res) => {
      console.log('RES: ', res);
      dispatch({
        type: GENERATE_SECRET_SUCCESS,
        payload: res.data,
      })
    }
    )
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "GENERATE_SECRET_FAIL"
        )
      );
      dispatch({
        type: GENERATE_SECRET_FAIL,
      });
    });
};

// Logout user
export const logout = () => {
  return {
    type: LOGOUT_SUCCESS,
  };
};

//Setup config/headers and token
export const tokenConfig = (getState) => {
  // Get token fron localstorage
  const token = getState().user.token;
  console.log('YYY: ', token);

  // Headers
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  // If token, add to headers
  if (token) {
    config.headers["x-auth-token"] = token;
  }

  console.log('CONFIG HEADERS cont type: ' + config.headers["Content-type"]);
  console.log('CONFIG HEADERS x-auth-token: ' + config.headers["x-auth-token"]);

  return config;
};
