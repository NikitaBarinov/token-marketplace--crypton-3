task("registration", "Registered user on trading floor")
.addParam("firstRefer", "Address of first refer for referal program")
.addParam("secondRefer", "Address of econd refer for referal programm")
.setAction(async (taskArgs) => {
  const [first, second] = await hre.ethers.getSigners();
  const tradingFloor = await hre.ethers.getContractAt("TradingFloor", process.env.DAO_ADDRESS);
  
  const result = await tradingFloor
    .connect(second)
    .registration(
      taskArgs.firstRefer,
      taskArgs.secondRefer
  );
  console.log('Transaction hash:',result.hash);
});
