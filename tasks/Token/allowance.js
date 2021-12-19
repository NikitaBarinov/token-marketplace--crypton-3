task("allowance", "To get alloance of address")
.addParam("addressOwner", "The account address")
.addParam("addressSpender", "The account address")
.setAction(async (taskArgs) => {
const token = await hre.ethers.getContractAt("Token", process.env.TOKEN_ADDRESS)

const result = await token.allowance(
    taskArgs.addressOwner,
    taskArgs.addressSpender);
allow = result.toNumber();

console.log('Allowance:',allow); 
});
