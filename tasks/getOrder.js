var fs = require('fs');

task("getOrder", "To get info about choisen order")
.addParam("orderId", "Index of choisen order")
.setAction(async (taskArgs) => {
    const tradingFloor = await hre.ethers.getContractAt("TradingFloor", process.env.TRADINGFLOOR_ADDRESS);
  
    const result = await tradingFloor.connect(second).getOrder(taskArgs.orderId);
    
    console.log('Owner:',result.owner);
    console.log('Balance:',result.balance);
    console.log('Total amount ACDM:',result.totalAmountACDM);
    console.log('Total price ACDM:',result.totalPriceForACDM);
    console.log('Open ?:',result.open);
});
