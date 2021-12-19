task("deposit", "Deposite tokens on dao")
.addParam("value", "A value of tokens")
.setAction(async (taskArgs) => {

const [first, second] = await hre.ethers.getSigners();
const dao = await hre.ethers.getContractAt("DAO", process.env.DAO_ADDRESS);

const result = await dao
  .connect(second)
  .deposit(
    taskArgs.value
);
console.log('Transaction hash:',result.hash);
});
  