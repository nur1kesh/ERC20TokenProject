const { Web3 } = require("web3");
const fs = require("fs");

const RPC_URL = "https://ethereum-holesky-rpc.publicnode.com/";
const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));

const privateKey = "0x5796d5135b91d545183376c9cb0e18c5af73195c7d2bd312391a075536e6aa16";
const walletAddress = "0x1a54D56776185c4a22dA072E61cA5C35Da9e8d71";

const contractPath = "./artifacts/contracts/AITU_Nurassyl.sol/AITU_Nurassyl.json";
const contractData = JSON.parse(fs.readFileSync(contractPath).toString());
const abi = contractData.abi;
const bytecode = contractData.bytecode;

async function main() {
  try {
    const block = await web3.eth.getBlock(0);
    console.log("Genesis Block:", block);

    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);

    const contract = new web3.eth.Contract(abi);

    const deployment = contract.deploy({
      data: bytecode,
    });

    const gas = await deployment.estimateGas({ from: walletAddress });
    console.log(`Estimated Gas: ${gas}`);

    const receipt = await deployment.send({
      from: walletAddress,
      gas,
    });

    console.log("Contract deployed at address:", receipt.options.address);
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

main();