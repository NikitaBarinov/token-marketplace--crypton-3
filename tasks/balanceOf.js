task("balanceOf", "To get balance of address")
.addParam("addressOf", "The account address")
.setAction(async (taskArgs) => {

const token = await hre.ethers.getContractAt("Token", process.env.TOKEN_ADDRESS)

const result = await token.balanceOf(taskArgs.addressOf);
balance = result.toNumber();
    
console.log('Balance:',balance); 
});
