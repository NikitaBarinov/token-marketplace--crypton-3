task("transferOwnership", "Transfer ownership to address")
.addParam("addressnewOwner", "The new owner's address")
.setAction(async (taskArgs) => {
  const [first, second] = await hre.ethers.getSigners();
  const token = await hre.ethers.getContractAt("Token", process.env.TOKEN_ADDRESS)

  const result = await token
  .connect(second)
  .transferOwnership(
    taskArgs.addressnewOwner
  );
    
  console.log('Transaction hash:',result.hash);
});
