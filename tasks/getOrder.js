var fs = require('fs');


task("getOrder", "To get info about choisen order")
.addParam("orderId", "Index of choisen order")
.setAction(async (taskArgs) => {
    const tradingFloor = await hre.ethers.getContractAt("TradingFloor", process.env.TRADINGFLOOR_ADDRESS);
  

const proposal = await tradingFloor.connect(second)
.getOrder(taskArgs.orderId);

console.log('Transaction hash:',proposal._balance);
console.log('Transaction hash:',proposal._totalAmountACDM);
console.log('Transaction hash:',proposal._totalPriceForACDM);
});
