task("getUnlockBalance", "Get time then balancce will be unlocked")
.addParam("target", "Address of target")
.setAction(async (taskArgs) => {
  const [first, second] = await hre.ethers.getSigners();
const dao = await hre.ethers.getContractAt("DAO", process.env.DAO_ADDRESS);

const result = await dao
  .connect(second)
  .getUnlockBalance(
    taskArgs.target
);
console.log('Time:',result);
});
  