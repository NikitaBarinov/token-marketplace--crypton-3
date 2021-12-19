task("withdraw", "Withdraw tokens from dao")
.addParam("amount", "The amount of tokens")
.setAction(async (taskArgs) => {
  const [first, second] = await hre.ethers.getSigners();
  const dao = await hre.ethers.getContractAt("DAO", process.env.DAO_ADDRESS);
  
  const result = await dao
    .connect(second)
    .withdraw(
      taskArgs.amount
  );
  console.log('Transaction hash:',result.hash);
});
  