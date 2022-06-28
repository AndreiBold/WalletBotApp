import { combineReducers } from "redux";
import userReducer from "./user-reducer";
import errorReducer from "./error-reducer";

export default combineReducers({
  user: userReducer,
  error: errorReducer,
});
