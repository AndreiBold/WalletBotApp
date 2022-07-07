import {
  GET_TRANSACTIONS_SUCCESS,
  GET_TRANSACTIONS_FAIL,
  SEND_TRANSACTION_SUCCESS,
  SEND_TRANSACTION_FAIL,
  TRANSACTIONS_LOADING,
} from "../actions/types";

const INITIAL_STATE = {
  transactions: [],
  loading: false,
  message: "",
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        transactions: action.payload.transactions,
        loading: false,
      };
    case SEND_TRANSACTION_SUCCESS:
      return {
        ...state,
        transactions: [action.payload.newTransaction, ...state.transactions],
        message: action.payload.message,
      };
    case TRANSACTIONS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_TRANSACTIONS_FAIL:
    case SEND_TRANSACTION_FAIL:
      return {
        ...state,
        loading: false,
        message: "",
      };
    default:
      return state;
  }
}
