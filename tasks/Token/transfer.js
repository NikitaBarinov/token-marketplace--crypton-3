task("transfer", "Transfer coins to address")
.addParam("addressSpender", "The client account address")
.addParam("value", "A value of coins")
.setAction(async (taskArgs) => {
const [first, second] = await hre.ethers.getSigners();
const token = await hre.ethers.getContractAt("Token", process.env.TOKEN_ADDRESS)

const result = await token
.connect(second)
.transfer(
  taskArgs.addressSpender,
  taskArgs.value
);
console.log('Transaction hash:',result.hash);
});
