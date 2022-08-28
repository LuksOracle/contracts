const Web3 = require('web3');
const UniversalProfile = require('@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json');
const KeyManager = require('@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json');

const web3 = new Web3('https://rpc.l16.lukso.network');
const myUPAddress = "0x8414F1BaC5fCdA2C274A4a78D0D62109f1Cbb6C8"

const PRIVATE_KEY = "0x" + process.env.devTestnetPrivateKey; // add the private key of your EOA here (created in Step 1)
const myEOA = web3.eth.accounts.wallet.add(PRIVATE_KEY); // amount of LYX we want to transfer

const contractAddress_JS = '0xeBFC916C62B4dBcC29450D437136446fccfB658f'
const contractABI_JS =
[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkFulfilled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkRequested","type":"event"},{"anonymous":false,"inputs":[],"name":"tweetRequestEvent","type":"event"},{"inputs":[{"internalType":"bytes32","name":"_requestId","type":"bytes32"},{"internalType":"bytes32","name":"compressedAddressUint96","type":"bytes32"}],"name":"fulfillTweetAddressCompare","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint96","name":"twitter_id_Request","type":"uint96"}],"name":"requestTweetAddressCompare","outputs":[{"internalType":"bytes32","name":"requestId","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint96","name":"_twitter_id","type":"uint96"}],"name":"resolveToTwitterID","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"addressTwitterID","outputs":[{"internalType":"uint96","name":"","type":"uint96"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint96","name":"","type":"uint96"}],"name":"twitterIDaddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]


const contractDefined_JS = new web3.eth.Contract(contractABI_JS, contractAddress_JS)

//Twitter ID: https://twitter.com/i/user/1563659416347430912
const twitterID = "1563659416347430912"
const twitterRequestData = contractDefined_JS.methods.requestTweetAddressCompare(twitterID).encodeABI()

const chainlinkInterfaceERC20_ADDRESS = '0xbFB26279a9D28CeC1F781808Da89eFbBfE2c4268'
const chainlinkInterfaceERC20_ABI =
[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
const chainlinkInterfaceERC20_CONTRACT = new web3.eth.Contract(chainlinkInterfaceERC20_ABI, chainlinkInterfaceERC20_ADDRESS)

async function main() {

  // 1. instantiate your contracts
  const myUP = new web3.eth.Contract(UniversalProfile.abi, myUPAddress);

  // the KeyManager is the owner of the Universal Profile
  // so we can call the owner() function to obtain the KeyManager's address
  const owner = await myUP.methods.owner().call();
  console.log(owner)

  const myKM = new web3.eth.Contract(KeyManager.abi, owner);

  const OPERATION_CALL = 0;
  const recipient = contractAddress_JS; // address the recipient (any address, including an other UP)
  const amount = web3.utils.toWei('0');
  // payload executed at the target (here nothing, just a plain LYX transfer)
  const data = twitterRequestData;

  // 2. encode the payload to transfer 3 LYX from the UP
  const transferLYXPayload = await myUP.methods
    .execute(OPERATION_CALL, recipient, amount, data)
    .encodeABI();

    console.log(transferLYXPayload)

    chainlinkInterfaceERC20_CONTRACT.methods.balanceOf(contractAddress_JS).call((err, balanceLINK) => {
      console.log({ err, balanceLINK })
      if((balanceLINK >= "1000000000000000000") == false) {
        throw new Error("NEED 1 OR MORE LINK TO SEND CHAINLINK TWITTER REQUEST!");
      }
    })

  // 3. execute the LYX transfer via the Key Manager
  const executeTx = await myKM.methods.execute(transferLYXPayload).send({
    from: myEOA.address,
    gasLimit: 300000,
  });

  console.log(executeTx)

}

main()
