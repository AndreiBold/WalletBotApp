import { returnErrors } from "./errorActions";
import {
  GET_ADDRESSES_SUCCESS,
  GET_ADDRESSES_FAIL,
  GET_ADDRESS_SUCCESS,
  GET_ADDRESS_FAIL,
  ADD_ADDRESS_SUCCESS,
  ADD_ADDRESS_FAIL,
  DELETE_ADDRESS_SUCCESS,
  DELETE_ADDRESS_FAIL,
  ADDRESSES_LOADING,
} from "./types";
import { tokenConfig } from "./userActions";
import client from "../config/config";

// Get list of addresses
export const getAddresses = () => (dispatch, getState) => {
  // addresses loading
  dispatch(setAddressesLoading());

  client
    .get("addresses/", tokenConfig(getState))
    .then((res) => {
      console.log("RES ADDRESSES: " + res);
      dispatch({
        type: GET_ADDRESSES_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "GET_ADDRESSES_FAIL"
        )
      );
      dispatch({
        type: GET_ADDRESSES_FAIL,
      });
    });
};

// Add address
export const addAddress =
  ({ hexValue, name }) =>
  (dispatch, getState) => {
    console.log("hexValue: " + hexValue);
    console.log("name: " + name);
    //Request body
    const body = JSON.stringify({ hexValue, name });

    client
      .post("addresses/add", body, tokenConfig(getState))
      .then((res) => {
        console.log("RES: ", res);
        dispatch({
          type: ADD_ADDRESS_SUCCESS,
          payload: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          returnErrors(
            err.response.data,
            err.response.status,
            "ADD_ADDRESS_FAIL"
          )
        );
        dispatch({
          type: ADD_ADDRESS_FAIL,
        });
      });
  };

// Remove address
export const removeAddress = (hexValue) => (dispatch, getState) => {
  console.log("hexValue: " + hexValue);

  client
    .delete(`addresses/remove/${hexValue}`, tokenConfig(getState))
    .then((res) => {
      console.log("RES: ", res);
      dispatch({
        type: DELETE_ADDRESS_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "DELETE_ADDRESS_FAIL"
        )
      );
      dispatch({
        type: DELETE_ADDRESS_FAIL,
      });
    });
};

// Get address
export const getAddress = (hexValue) => (dispatch, getState) => {
  console.log("hexValue: " + hexValue);

  client
    .get(`addresses/${hexValue}`, tokenConfig(getState))
    .then((res) => {
      console.log("RES: ", res);
      dispatch({
        type: GET_ADDRESS_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch(
        returnErrors(err.response.data, err.response.status, "GET_ADDRESS_FAIL")
      );
      dispatch({
        type: GET_ADDRESS_FAIL,
      });
    });
};

export const setAddressesLoading = () => {
  return {
    type: ADDRESSES_LOADING,
  };
};
