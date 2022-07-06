import Web3 from "web3/dist/web3.min.js";

const Web3API = new Web3(
  new Web3.providers.HttpProvider(process.env.REACT_APP_INFURA_ROPSTEN_HTTP_URL)
);

export default Web3API;
