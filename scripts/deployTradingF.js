const fs = require('fs');

async function main() {
    const accounts = await ethers.getSigners();
    console.log('Deploying contract with account:',accounts[1].address);
    
    const balance = await accounts[1].getBalance();
    console.log('Account balance ',balance.toString());
 
    const TradingFloor = await ethers.getContractFactory("TradingFloor");
    const tradingFloor = await TradingFloor.deploy(process.env.TOKEN_ADDRESS);
    await tradingFloor.deployed();

    console.log('TradingFloor address:', tradingFloor.address);
    
    fs.appendFileSync(
      `.env`,
    `\r\# Deployed at \rTRADINGFLOOR_ADDRESS=${tradingFloor.address}\r`
    );
}   

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 
