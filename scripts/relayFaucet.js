const Web3 = require('web3')

const rpcURL = "https://rpc.l16.lukso.network"// Your RPC URL goes here
const web3 = new Web3(rpcURL)

const controllerPrivateKey = "0x" + process.env.devTestnetPrivateKey;
const myUpAddress = '0x8414F1BaC5fCdA2C274A4a78D0D62109f1Cbb6C8';

const UniversalProfileContract = require('@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json');
const KeyManagerContract = require('@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json');

const contractAddress_JS = '0xe33EE68Fc5477Ea95F4897b67d3E763b7F74FC52'
const contractABI_JS =
[{"anonymous":false,"inputs":[],"name":"faucetWithdraw","type":"event"},{"inputs":[],"name":"relayAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userPreviousWithdrawTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdrawDirect","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"relayCaller","type":"address"}],"name":"withdrawRelay","outputs":[],"stateMutability":"nonpayable","type":"function"}]

const contractDefined_JS = new web3.eth.Contract(contractABI_JS, contractAddress_JS)

const chainlinkInterfaceERC20_ADDRESS = '0xbFB26279a9D28CeC1F781808Da89eFbBfE2c4268'
const chainlinkInterfaceERC20_ABI =
[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
const chainlinkInterfaceERC20_CONTRACT = new web3.eth.Contract(chainlinkInterfaceERC20_ABI, chainlinkInterfaceERC20_ADDRESS)


const airdropWallet = "0xc1202e7d42655F23097476f6D48006fE56d38d4f"
const faucetRelayMethodData = contractDefined_JS.methods.withdrawRelay(airdropWallet).encodeABI()
// console.log(faucetRelayMethodData)

async function myFunction() {

const myUniversalProfile = new web3.eth.Contract(
  UniversalProfileContract.abi,
  myUpAddress,
);

const keyManagerAddress = await myUniversalProfile.methods.owner().call();
// console.log(keyManagerAddress)
const KeyManager = new web3.eth.Contract(
  KeyManagerContract.abi,
  keyManagerAddress,
);

const controllerAccount =
  web3.eth.accounts.wallet.add(controllerPrivateKey)
const channelId = 0; // Can be any number that your app will use frequently.
// Channel IDs prevent nonce conflicts, when many apps send transactions to your keyManager at the same time.

const nonce = await KeyManager.methods
  .getNonce(controllerAccount.address, channelId)
  .call();

  const abiPayload = myUniversalProfile.methods.execute(
      0, // The OPERATION_CALL value. 0 for a LYX transaction
      contractAddress_JS, // Recipient address
      web3.utils.toWei('0'), // amount of LYX to send in wei
      faucetRelayMethodData // Call data, to be called on the recipient address, or '0x'
  ).encodeABI() ;

  const chainId = await web3.eth.getChainId(); // will be 2828 on l16

const message = web3.utils.soliditySha3(chainId, keyManagerAddress, nonce, {
  t: 'bytes',
  v: abiPayload,
});

const signatureObject = controllerAccount.sign(message);
const signature = signatureObject.signature;

console.log("signature: " + signature)
console.log("nonce: " + nonce)
console.log("abiPayload:" + abiPayload)
console.log("UP Key manager: " + controllerAccount.address)

contractDefined_JS.methods.userPreviousWithdrawTime(airdropWallet).call((err, userPreviousWithdrawTime) => {
  console.log({ err, userPreviousWithdrawTime })
  console.log(Date.now()-43200)
  if( ( (Date.now()-43200) > userPreviousWithdrawTime) == false ) {
    throw new Error("Current user must wait 12 hours for faucet cooldown.");
  }
})

chainlinkInterfaceERC20_CONTRACT.methods.balanceOf(contractAddress_JS).call((err, balanceLINK) => {
  console.log({ err, balanceLINK })
  if((balanceLINK >= "20000000000000000000") == false) {
    throw new Error("NOT ENOUGH LINK IN CONTRACT!");
  }
})

const executeRelayCallTransaction = await KeyManager.methods
      .executeRelayCall(signature, nonce, abiPayload)
      .send({from: controllerAccount.address, gasLimit: 300_000});
    console.log("executeRelayCallTransaction: " + executeRelayCallTransaction)

}

myFunction();
