task("finishVote", "To get alloance of address")
.addParam("proposalId", "Index of finisheing proposal")

.setAction(async (taskArgs) => {
const dao = await hre.ethers.getContractAt("DAO", process.env.DAO_ADDRESS)

const result = await dao.finishVote(
    taskArgs.proposalId);


console.log('Allowance:',result); 
});
