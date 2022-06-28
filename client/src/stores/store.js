import { applyMiddleware, createStore, compose } from "redux";

import thunk from "redux-thunk";
import rootReducer from "../reducers";

const INITIAL_STATE = {};

const middlewareList = [thunk];
const middleware = applyMiddleware(...middlewareList);

const store = createStore(
  rootReducer,
  INITIAL_STATE,
  compose(
    middleware,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
