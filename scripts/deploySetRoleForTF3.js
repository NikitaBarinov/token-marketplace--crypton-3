const fs = require('fs');

async function main() {
    const accounts = await ethers.getSigners();
    console.log('Deploying contract with account:',accounts[1].address);
    
    const balance = await accounts[1].getBalance();
    console.log('Account balance ',balance.toString());
    const token = await hre.ethers.getContractAt("ACDM", process.env.TOKEN_ADDRESS);
     
    await token.connect(accounts[1]).setRoleForTradingFloor(process.env.TRADINGFLOOR_ADDRESS);
    console.log("Set role for trading floor successfuly complited");
}   

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 
