task("approve", "To get alloance of address")
.addParam("id", "Id of buyable order")
.addParam("amount", "The amount of ACDM")
.setAction(async (taskArgs) => {
const [first, second] = await hre.ethers.getSigners();

var tradingFloor = await hre.ethers.getContractAt("TradingFloor", process.env.TRADINGFLOOR_ADDRESS);

const result = await tradingFloor
.connect(second)
.buyOrder(
  taskArgs.id,
  taskArgs.amount
);

console.log('Transaction hash:',result.hash);
});


