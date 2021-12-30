task("finishRound", "Finish round and start new")
.setAction(async (taskArgs) => {
  const tradingFloor = await hre.ethers.getContractAt("TradingFloor", process.env.TRADINGFLOOR_ADDRESS);
  
  const [first, second] = await hre.ethers.getSigners();
  
  const result = await tradingFloor.connect(second)
  .finishRound();
    
  console.log('Transaction hash:',result.hash);
});
  