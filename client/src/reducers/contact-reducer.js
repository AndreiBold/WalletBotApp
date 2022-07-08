import {
  GET_CONTACTS_SUCCESS,
  GET_CONTACTS_FAIL,
  ADD_CONTACT_SUCCESS,
  ADD_CONTACT_FAIL,
  DELETE_CONTACT_SUCCESS,
  DELETE_CONTACT_FAIL,
  CONTACTS_LOADING,
  GET_CONTACT_BY_NAME_SUCCESS,
  GET_CONTACT_BY_NAME_FAIL
} from "../actions/types";

const INITIAL_STATE = {
  contacts: [],
  loading: false,
  isAdded: false,
  contactAddress: "" 
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_CONTACTS_SUCCESS:
      return {
        ...state,
        contacts: action.payload.contacts,
        loading: false,
        isAdded: false
      };
    case DELETE_CONTACT_SUCCESS:
      console.log('first', state.contacts.filter(
        (contact) => contact.contactId != action.payload.contactId
      ), 'action payload ', action.payload)
      return {
        ...state,
        contacts: state.contacts.filter(
          (contact) => contact.contactId != action.payload.contactId
        ),
      };
    case ADD_CONTACT_SUCCESS:
      return {
        ...state,
        contacts: [action.payload.newContact, ...state.contacts],
        isAdded: true,
      };
    case GET_CONTACT_BY_NAME_SUCCESS:
      return {
        ...state,
        contactAddress: action.payload.contactAgendaAddress
      }
    case CONTACTS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_CONTACTS_FAIL:
    case ADD_CONTACT_FAIL:
    case DELETE_CONTACT_FAIL:
    case GET_CONTACT_BY_NAME_FAIL:
      return {
        ...state,
        loading: false,
        isAdded: false
      }
    default:
      return state;
  }
}
