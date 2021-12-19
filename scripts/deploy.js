const fs = require('fs');

async function main() {
    const accounts = await ethers.getSigners();
    console.log('Deploying contract with account:',accounts[1].address);
    
    const balance = await accounts[1].getBalance();
    console.log('Account balance ',balance.toString());
    
    const metadataToken = JSON.parse(fs.readFileSync('artifacts/contracts/Token/Token.sol/Token.json'))
    const metadataDao = JSON.parse(fs.readFileSync('artifacts/contracts/DAO.sol/DAO.json'))
    

    const Token = await ethers.getContractFactory(metadataToken.abi, metadataToken.bytecode, accounts[1]);
    const token = await Token.deploy();
    await token.deployed();

    console.log('Token address:',token.address);

    const Dao = await ethers.getContractFactory(metadataDao.abi, metadataDao.bytecode, accounts[1]);
    const dao = await Dao.deploy(accounts[1].address, token.address, 500, 3600 * 24 * 3);
    await dao.deployed();
    token.connect(accounts[1].address).setDaoAddress(dao.address);

    console.log('Dao address:', dao.address);
    
    fs.appendFileSync(
      `.env`,
    `\r\# Deployed at \rTOKEN_ADDRESS=${token.address}\r`
    
    );
    fs.appendFileSync(
      `.env`,
    `\r\# Deployed at \rDAO_ADDRESS=${dao.address}\r`
    );
}   

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 
