import { returnErrors } from "./errorActions";
import {
  GET_TRANSACTIONS_SUCCESS,
  GET_TRANSACTIONS_FAIL,
  SEND_TRANSACTION_SUCCESS,
  SEND_TRANSACTION_FAIL,
  TRANSACTIONS_LOADING,
} from "./types";
import { tokenConfig } from "./userActions";
import client from "../config/config";

// Send transaction
export const sendTransaction =
  ({ from, to, amount, hashLink }) =>
  (dispatch, getState) => {
    console.log("from: " + from);
    console.log("to: " + to);
    console.log("amount: " + amount);
    console.log("hashLink: " + hashLink);
    //Request body
    const body = JSON.stringify({ from, to, amount, hashLink });

    client
      .post("transactions/send", body, tokenConfig(getState))
      .then((res) => {
        console.log("RES: ", res);
        dispatch({
          type: SEND_TRANSACTION_SUCCESS,
          payload: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          returnErrors(
            err.response.data,
            err.response.status,
            "SEND_TRANSACTION_FAIL"
          )
        );
        dispatch({
          type: SEND_TRANSACTION_FAIL,
        });
      });
  };

// Get transactions for an Ethereum address
export const getTransactions = (hexValue) => (dispatch, getState) => {
  console.log("hexValue: " + hexValue);

  client
    .get(`transactions/${hexValue}`, tokenConfig(getState))
    .then((res) => {
      console.log("RES: ", res);
      dispatch({
        type: GET_TRANSACTIONS_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "GET_TRANSACTIONS_FAIL"
        )
      );
      dispatch({
        type: GET_TRANSACTIONS_FAIL,
      });
    });
};

export const setTransactionsLoading = () => {
  return {
    type: TRANSACTIONS_LOADING,
  };
};
