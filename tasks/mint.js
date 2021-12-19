task("mint", "To mint tokens to target")
.addParam("target", "The target account address")
.addParam("mintedAmount", "Value to mint")
.setAction(async (taskArgs) => {
  const token = await hre.ethers.getContractAt("Token", process.env.TOKEN_ADDRESS)

  const [first, second] = await hre.ethers.getSigners();
  
  const result = await token.connect(second)
  .mint
  (
      taskArgs.target,
      taskArgs.mintedAmount
  );
    
  console.log('Transaction hash:',result.hash);
});
  