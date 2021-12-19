task("addProposal", "Add test proposal on dao")
.setAction(async (taskArgs) => {
const [first, second] = await hre.ethers.getSigners();

const token = await hre.ethers.getContractAt("Token", process.env.TOKEN_ADDRESS);
const dao = await hre.ethers.getContractAt("DAO", process.env.DAO_ADDRESS);

const setCommisionAbi = ["function setCommission(uint256 newCommission)"];
const setCommissionInt = new ethers.utils.Interface(setCommisionAbi);
TransactonByteCode = setCommissionInt.encodeFunctionData(
    'setCommission', [10]
);
  const result = await dao.connect(second)
                    .addProposal(
                      token.address,
                      "test proposal",
                      TransactonByteCode);
    
  console.log('Transaction hash:',result.hash);
});
  