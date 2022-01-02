task("balanceOfETH", "To get balance of address")
.addParam("addressOf", "The account address")
.setAction(async (taskArgs) => {


var tradingFloor = await hre.ethers.getContractAt("TradingFloor", process.env.TRADINGFLOOR_ADDRESS);

const result = await tradingFloor.balanceOfETH(taskArgs.addressOf);
    
console.log('Balance:',result); 
});
