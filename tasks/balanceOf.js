task("balanceOf", "To get balance of address")
.addParam("addressOf", "The account address")
.setAction(async (taskArgs) => {
const Web3 = require('web3');
const web3 = new Web3(process.env.API_URL);

var fs = require('fs');
var jsonFile = "frontend/src/Token.json";
var parsed= JSON.parse(fs.readFileSync(jsonFile));
var abi = parsed.abi;
var abiAdr = parsed.address;

var myContract = new web3.eth.Contract( abi,abiAdr);

const result = await myContract.methods.balanceOf(taskArgs.addressOf)
.call();

console.log('Balance:',result); 
});
