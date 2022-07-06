import {
  ADD_MESSAGE_LOADING,
  ADD_MESSAGE_SUCCESS,
  ADD_MESSAGE_FAIL,
  ADD_RESPONSE_LOADING,
  ADD_RESPONSE_SUCCESS,
  ADD_RESPONSE_FAIL,
} from "../actions/types";

const INITIAL_STATE = {
  messages: [],
  response: {},
  message: {},
  loading: false,
  fetched: false,
  err: "",
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case ADD_MESSAGE_LOADING:
    case ADD_RESPONSE_LOADING:
      return {
        ...state,
        loading: true,
        fetched: false,
        err: "",
      };
    case ADD_MESSAGE_FAIL:
    case ADD_RESPONSE_FAIL:
      return {
        ...state,
        loading: false,
        fetched: false,
        err: action.payload.message,
      };
    case ADD_MESSAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        fetched: true,
        message: action.payload,
        messages: [
          ...state.messages,
          { message: action.payload, type: "user" },
        ],
        err: "",
      };
    case ADD_RESPONSE_SUCCESS:
      return {
        ...state,
        loading: false,
        fetched: true,
        response: action.payload,
        messages: [...state.messages, { message: action.payload, type: "bot" }],
        err: "",
      };
    default:
      return state;
  }
}
