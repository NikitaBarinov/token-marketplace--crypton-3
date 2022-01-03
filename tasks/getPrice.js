task("getPrice", "Getter for price")
.setAction(async (taskArgs) => {
const [first, second] = await hre.ethers.getSigners();

var tradingFloor = await hre.ethers.getContractAt("TradingFloor", process.env.TRADINGFLOOR_ADDRESS);

const result = await tradingFloor
.connect(second)
.getPrice(
);

console.log('Price:',Number(result));
});


