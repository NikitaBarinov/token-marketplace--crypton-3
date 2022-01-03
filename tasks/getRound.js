task("getRound", "Getter for round")
.addParam("id", "Id of choisen round")
.setAction(async (taskArgs) => {
const [first, second] = await hre.ethers.getSigners();

var tradingFloor = await hre.ethers.getContractAt("TradingFloor", process.env.TRADINGFLOOR_ADDRESS);

const proposal = await tradingFloor
.connect(second)
.getRound(taskArgs.id);

console.log('Finish time:',proposal.finishTime);
console.log('Trading volume in ETH:',proposal.tradingVolumeETH);
console.log('Total supply of round:',proposal.totalSupply);
console.log('Trade round ?:',proposal.saleOrTrade);
});

