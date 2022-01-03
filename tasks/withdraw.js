task("withdraw", "To get alloance of address")
.addParam("to", "Address of receiver")
.addParam("amount", "Amount of recivable ETH")
.setAction(async (taskArgs) => {
const [first, second] = await hre.ethers.getSigners();

var tradingFloor = await hre.ethers.getContractAt("TradingFloor", process.env.TRADINGFLOOR_ADDRESS);

const result = await tradingFloor
.connect(second)
.closeOrder(
  taskArgs.to,
  taskArgs.amount
);

console.log('Transaction hash:',result.hash);
});


