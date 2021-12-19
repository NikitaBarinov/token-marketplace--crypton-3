task("transferFrom", "To get alloance of address")
.addParam("addressFrom", "The account spender address")
.addParam("addressTo", "The recipient account address")
.addParam("value", "Value to spend ")
.setAction(async (taskArgs) => {
    const [first, second] = await hre.ethers.getSigners();
    const token = await hre.ethers.getContractAt("Token", process.env.TOKEN_ADDRESS)

    const result = await token
    .connect(first)
    .transferFrom(
      taskArgs.addressFrom,
      taskArgs.addressTo,
      taskArgs.value
    );
      
    console.log('Transaction hash:',result.hash);
});
  