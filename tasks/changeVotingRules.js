task("changeVotingRules", "to change voting rules")
.addParam("minimumQuorum", "Minimum quorum for successful vote")
.addParam("debatingPeriod", "debating period for vote")
.setAction(async (taskArgs) => {
  const [first, second] = await hre.ethers.getSigners();
  const dao = await hre.ethers.getContractAt("DAO", process.env.DAO_ADDRESS);
  
  const result = await dao
    .connect(second)
    .changeVotingRules(
      taskArgs.minimumQuorum,
      taskArgs.debatingPeriod
  );
  console.log('Transaction hash:',result.hash);
});
