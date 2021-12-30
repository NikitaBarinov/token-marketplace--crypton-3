task("addOrder", "Add test proposal on dao")
.addParam("totalPrice", "Total price in ETH for amount ACDM")
.addParam("amount", "Amount of ACDM in order")
.setAction(async (taskArgs) => {
const [first, second] = await hre.ethers.getSigners();

  const tradingFloor = await hre.ethers.getContractAt("TradingFloor", process.env.TRADINGFLOOR_ADDRESS);

  const result = await tradingFloor.connect(second)
                    .addOrder(
                      taskArgs.totalPrice,
                      taskArgs.amount
                    );
    
  console.log('Transaction hash:',result.hash);
});
  