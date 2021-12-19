task("burn", "To burn tokens of address")
.addParam("target", "The target account address")
.addParam("burnedAmount", "Value of burned amount ")
.setAction(async (taskArgs) => {
  const token = await hre.ethers.getContractAt("Token", process.env.TOKEN_ADDRESS)

  const [first, second] = await hre.ethers.getSigners();
  
  const result = await token.connect(second)
  .burn
  (
      taskArgs.target,
      taskArgs.burnedAmount
  );
    
  console.log('Transaction hash:',result.hash);
});
  