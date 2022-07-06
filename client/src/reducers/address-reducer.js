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
} from "../actions/types";

const INITIAL_STATE = {
  addresses: [],
  loading: false,
  selectedAddress: {},
  message: ""
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_ADDRESSES_SUCCESS:
      return {
        ...state,
        addresses: action.payload.addresses,
        loading: false,
      };
    case GET_ADDRESS_SUCCESS:
      return {
        ...state,
        selectedAddress: action.payload.address,
      };
    case DELETE_ADDRESS_SUCCESS:
      return {
        ...state,
        addresses: state.addresses.filter(
          (address) => address.hexValue != action.payload.hexValue
        ),
        message: action.payload.message
      };
    case ADD_ADDRESS_SUCCESS:
      return {
        ...state,
        addresses: [action.payload.newAddress, ...state.addresses],
        message: action.payload.message
      };
    case ADDRESSES_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_ADDRESSES_FAIL:
    case ADD_ADDRESS_FAIL:
    case DELETE_ADDRESS_FAIL:
    case GET_ADDRESS_FAIL:
      return {
        ...state,
        loading: false,
        message: ""
      };
    default:
      return state;
  }
}
