var fs = require('fs');


task("getProposal", "To get total supply of coins")
.addParam("proposalId", "Index of choisen proposal")
.setAction(async (taskArgs) => {
const metadataDao = JSON.parse(fs.readFileSync('artifacts/contracts/DAO.sol/DAO.json'))

var abi = metadataDao.abi;
var abiAdr = process.env.DAO_ADDRESS;

var myContract = new web3.eth.Contract( abi,abiAdr);

const proposal = await myContract.methods.getProposal(
    taskArgs.proposalId
).call();

console.log('Transaction hash:',proposal.transactionByteCode);
console.log('Transaction hash:',proposal.recipient);
console.log('Transaction hash:',proposal.description);
console.log('Transaction hash:',proposal.totalVotes);
console.log('Transaction hash:',proposal.totalVotesFor);
console.log('Transaction hash:',proposal.endTime);
console.log('Transaction hash:',proposal.open);
});
