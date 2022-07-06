import { combineReducers } from "redux";
import userReducer from "./user-reducer";
import errorReducer from "./error-reducer";
import contactReducer from "./contact-reducer";
import chatReducer from "./chat-reducer";
import addressReducer from "./address-reducer";

export default combineReducers({
  user: userReducer,
  error: errorReducer,
  contact: contactReducer,
  chat: chatReducer,
  address: addressReducer
});
