task("totalSupply", "To get total supply of coins")
.setAction(async (taskArgs) => {
const Web3 = require('web3');
const web3 = new Web3(process.env.API_URL);

const token = await hre.ethers.getContractAt("Token", process.env.TOKEN_ADDRESS)

const result = await token.totalSupply();
totalSup = result.toNumber();


console.log('Total supply:',totalSup); 
});
