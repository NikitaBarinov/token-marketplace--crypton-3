task("getVote", "To get choisen vote")
.addParam("voter", "Address voter")
.addParam("proposalId", "Index of proposal")
.setAction(async (taskArgs) => {
  const [first, second] = await hre.ethers.getSigners();
const dao = await hre.ethers.getContractAt("DAO", process.env.DAO_ADDRESS);

const result = await dao
  .getVote(
    taskArgs.voter,
    taskArgs.proposalId
);
console.log('Choisen result:',result);
});
  