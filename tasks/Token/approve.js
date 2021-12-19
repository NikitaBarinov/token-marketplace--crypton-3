require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require("web3");

task("approve", "To get alloance of address")
.addParam("addressSpender", "The account spender address")
.addParam("value", "A value to allow")
.setAction(async (taskArgs) => {
const [first, second] = await hre.ethers.getSigners();
const token = await hre.ethers.getContractAt("Token", process.env.TOKEN_ADDRESS)

const result = await token
.connect(second)
.approve(
  taskArgs.addressSpender,
  taskArgs.value
);

console.log('Transaction hash:',result.hash);
});


