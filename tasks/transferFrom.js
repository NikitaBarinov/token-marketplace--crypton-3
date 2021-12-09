task("transferFrom", "To get alloance of address")
.addParam("addressFrom", "The account spender address")
.addParam("addressTo", "The recipient account address")
.addParam("value", "Value to spend ")
.setAction(async (taskArgs) => {
const Web3 = require('web3');
const web3 = new Web3(process.env.API_URL);

var fs = require('fs');
var jsonFile = "frontend/src/Token.json";
var parsed= JSON.parse(fs.readFileSync(jsonFile));
var abi = parsed.abi;
var abiAdr = parsed.address;
var owner = parsed.addressOwner;

var myContract = new web3.eth.Contract( abi,abiAdr);
const networkId = await web3.eth.net.getId();
const gasPrice = await web3.eth.getGasPrice();
const data = myContract.methods.transferFrom(
    taskArgs.addressFrom,
    taskArgs.addressTo,
    taskArgs.value)
    .encodeABI();

const signedTx = await web3.eth.accounts.signTransaction(
  {
    to: myContract.options.address,
    from:owner,
    data,
    gas:9000000,
    gasPrice,
    chainId: networkId
  },
  process.env.PRIVATE_KEY
);

const receipt = await web3.eth.sendSignedTransaction(
  signedTx.rawTransaction
);

console.log('Transaction hash:',receipt.transactionHash);
});
  