import { returnErrors } from "./errorActions";
import {
  GET_CONTACTS_SUCCESS,
  GET_CONTACTS_FAIL,
  ADD_CONTACT_SUCCESS,
  ADD_CONTACT_FAIL,
  DELETE_CONTACT_SUCCESS,
  DELETE_CONTACT_FAIL,
  CONTACTS_LOADING,
} from "./types";
import { tokenConfig } from "./userActions";
import client from "../config/config";

// Get list of contacts
export const getContacts = () => (dispatch, getState) => {
  // contacts loading
  dispatch(setContactsLoading());

  client
    .get("contacts/", tokenConfig(getState))
    .then((res) => {
      console.log('RES CONTACTS: ' + res);
      dispatch({
        type: GET_CONTACTS_SUCCESS,
        payload: res.data,
      })
    }
    )
    .catch((err) => {
      console.log(err);
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "GET_CONTACTS_FAIL"
        )
      );
      dispatch({
        type: GET_CONTACTS_FAIL,
      });
    });
};

// Add contact
export const addContact =
  ({ contactName, hexAddress }) =>
  (dispatch, getState) => {
    console.log("contactName: " + contactName);
    console.log("hexAddress: " + hexAddress);
    //Request body
    const body = JSON.stringify({ contactName, hexAddress });

    client
      .post("contacts/add", body, tokenConfig(getState))
      .then((res) => {
        console.log("RES: ", res);
        dispatch({
          type: ADD_CONTACT_SUCCESS,
          payload: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          returnErrors(
            err.response.data,
            err.response.status,
            "ADD_CONTACT_FAIL"
          )
        );
        dispatch({
          type: ADD_CONTACT_FAIL,
        });
      });
  };

// Remove contact
export const removeContact =
  (contactId) =>
  (dispatch, getState) => {
    console.log("contactId: " + contactId);

    client
      .delete(`contacts/remove/${contactId}`, tokenConfig(getState))
      .then((res) => {
        console.log("RES: ", res);
        dispatch({
          type: DELETE_CONTACT_SUCCESS,
          payload: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          returnErrors(
            err.response.data,
            err.response.status,
            "DELETE_CONTACT_FAIL"
          )
        );
        dispatch({
          type: DELETE_CONTACT_FAIL,
        });
      });
  };

export const setContactsLoading = () => {
  return {
    type: CONTACTS_LOADING,
  };
};
