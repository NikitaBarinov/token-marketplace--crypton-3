task("buyAcdmInSale", "Buy acdm tokens in sale round")
.addParam("amount", "The amount of ACDM")
.setAction(async (taskArgs) => {
const [first, second] = await hre.ethers.getSigners();

var tradingFloor = await hre.ethers.getContractAt("TradingFloor", process.env.TRADINGFLOOR_ADDRESS);

const result = await tradingFloor
.connect(second)
.buyACDMInSale(
  taskArgs.amount
);

console.log('Transaction hash:',result.hash);
});


