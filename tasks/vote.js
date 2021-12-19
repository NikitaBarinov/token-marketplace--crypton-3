task("vote", "Vote to proposal")
.addParam("proposalId", "Index of proposal")
.addParam("supportAgainst", "True or false in proposal")
.setAction(async (taskArgs) => {
  const [first, second] = await hre.ethers.getSigners();
const dao = await hre.ethers.getContractAt("DAO", process.env.DAO_ADDRESS);

const result = await dao
  .connect(second)
  .vote(
    taskArgs.proposalId,
    taskArgs.supportAgainst
);
console.log('Transaction hash:',result.hash);
});
  