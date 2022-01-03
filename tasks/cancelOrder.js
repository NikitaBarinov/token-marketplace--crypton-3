task("cancelOrder", "To get alloance of address")
.addParam("id", "Id of closable order")
.setAction(async (taskArgs) => {
const [first, second] = await hre.ethers.getSigners();

var tradingFloor = await hre.ethers.getContractAt("TradingFloor", process.env.TRADINGFLOOR_ADDRESS);

const result = await tradingFloor
.connect(second)
.closeOrder(
  taskArgs.id
);

console.log('Transaction hash:',result.hash);
});


