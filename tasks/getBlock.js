require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require("web3");

task("getBlock", "To get alloance of address")

.setAction(async (taskArgs) => {
  const dao = await hre.ethers.getContractAt("DAO", process.env.DAO_ADDRESS);

  console.log(process.env.DAO_ADDRESS);
      
  const result = await dao.getBlockTimeStamp();
  balance = result.toNumber();
  console.log(process.env.DAO_ADDRESS);
      
  console.log('Balance:',balance); 
});


