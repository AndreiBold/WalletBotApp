import {
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  GENERATE_SECRET_SUCCESS,
  GENERATE_SECRET_FAIL
} from "../actions/types";

const INITIAL_STATE = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  isLoading: false,
  userData: null,
  message: "",
  generatedSecret: null,
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        userData: action.payload,
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case REGISTER_FAIL:
    case GENERATE_SECRET_FAIL:
    case LOGOUT_SUCCESS:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        userData: null,
        isAuthenticated: false,
        isLoading: false,
        message: "",
        generatedSecret: null
      };
    case GENERATE_SECRET_SUCCESS:
      return {
        ...state,
        generatedSecret: action.payload,
        isAuthenticated: true,
        isLoading: false,
        message: action.payload.message
      }
    default:
      return state;
  }
}
