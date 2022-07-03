import { combineReducers } from "redux";
import userReducer from "./user-reducer";
import errorReducer from "./error-reducer";
import contactReducer from "./contact-reducer";

export default combineReducers({
  user: userReducer,
  error: errorReducer,
  contact: contactReducer
});
