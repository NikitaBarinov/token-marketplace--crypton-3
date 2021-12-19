task("delegate", "Delegates tokens for one vote")
.addParam("proposalId", "Index of proposal")
.addParam("delegat", "Address to")
.setAction(async (taskArgs) => {
  const [first, second] = await hre.ethers.getSigners();
const dao = await hre.ethers.getContractAt("DAO", process.env.DAO_ADDRESS);

const result = await dao
  .connect(second)
  .delegate(
    taskArgs.proposalId,
    taskArgs.delegat
);
console.log('Transaction hash:',result.hash);
});
  