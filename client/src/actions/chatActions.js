import {
  ADD_MESSAGE_LOADING,
  ADD_MESSAGE_SUCCESS,
  ADD_MESSAGE_FAIL,
  ADD_RESPONSE_LOADING,
  ADD_RESPONSE_SUCCESS,
  ADD_RESPONSE_FAIL,
} from "./types";
import { returnErrors } from "./errorActions";
import { tokenConfig } from "./userActions";
import client from "../config/config";

export const userMessage = (message) => async (dispatch) => {
  dispatch({ type: ADD_MESSAGE_LOADING });

  try {
    dispatch({
      type: ADD_MESSAGE_SUCCESS,
      payload: message,
    });
  } catch (err) {
    dispatch(
      returnErrors(err.response.data, err.response.status, "ADD_MESSAGE_FAIL")
    );
    dispatch({
      type: ADD_MESSAGE_FAIL,
    });
  }
};

export const botMessage =
  ({ context, message }) =>
  async (dispatch, getState) => {
    dispatch({ type: ADD_RESPONSE_LOADING });
    const body = JSON.stringify({
      context,
      message,
    });

    try {
      const res = await client.post("/chat", body, tokenConfig(getState));

      dispatch({
        type: ADD_RESPONSE_SUCCESS,
        payload: res.data,
      });
    } catch (err) {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "ADD_RESPONSE_FAIL"
        )
      );
      dispatch({
        type: ADD_RESPONSE_FAIL,
      });
    }
  };