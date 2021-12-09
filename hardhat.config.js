require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require("web3");
require("./tasks")
require('dotenv').config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks:{
    rinkeby:{
      url:process.env.API_URL,
      accounts:[`0x${process.env.PRIVATE_KEY}`]
    }
  }
};
