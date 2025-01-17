require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    holesky: {
      url: "https://ethereum-holesky-rpc.publicnode.com/",
      accounts: ['0x5796d5135b91d545183376c9cb0e18c5af73195c7d2bd312391a075536e6aa16'],
    },
  },
};