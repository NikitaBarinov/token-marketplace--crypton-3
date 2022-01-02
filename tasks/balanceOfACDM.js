task("balanceOfACDM", "To get balance of address")
.addParam("addressOf", "The account address")
.setAction(async (taskArgs) => {


var tradingFloor = await hre.ethers.getContractAt("TradingFloor", process.env.TRADINGFLOOR_ADDRESS);

const result = await tradingFloor.balanceOfACDM(taskArgs.addressOf);
    
console.log('Balance:',result); 
});
