const fs = require('fs');

async function main() {
    const accounts = await ethers.getSigners();
    console.log('Deploying contract with account:',accounts[1].address);
    
    const balance = await accounts[1].getBalance();
    console.log('Account balance ',balance.toString());
    const token = await hre.ethers.getContractAt("ACDM", process.env.TOKEN_ADDRESS);
    const tradingFloor = await hre.ethers.getContractAt("TradingFloor", process.env.TRADINGFLOOR_ADDRESS);
    

    
    token.connect(accounts[2]).setRoleForTradingFloor(process.env.TRADINGFLOOR_ADDRESS);
    tradingFloor.connect(accounts[2]).tradingFloorInit();
    console.log("Deploying successfuly complited");
}   

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 
