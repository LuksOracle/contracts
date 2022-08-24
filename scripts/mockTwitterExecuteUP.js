const Web3 = require('web3');
const UniversalProfile = require('@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json');
const KeyManager = require('@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json');

const web3 = new Web3('https://rpc.l16.lukso.network');
const myUPAddress = "0x8414F1BaC5fCdA2C274A4a78D0D62109f1Cbb6C8"

const PRIVATE_KEY = "0x" + process.env.devTestnetPrivateKey; // add the private key of your EOA here (created in Step 1)
const myEOA = web3.eth.accounts.wallet.add(PRIVATE_KEY); // amount of LYX we want to transfer

const contractAddress_JS = '0xf40b1F0101db074f4EB8aEeeD495B32af7DC21d8'
const contractABI_JS =
[{"anonymous":false,"inputs":[],"name":"tweetRequestEvent","type":"event"},{"inputs":[],"name":"_addressFromTweetMatches","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"addressTwitterID","outputs":[{"internalType":"uint96","name":"","type":"uint96"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mockFulfillLogic","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"mockRequestReturnValue","type":"uint256"}],"name":"mockRequestAnswer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint96","name":"twitter_id_Request","type":"uint96"}],"name":"requestTweetAddressCompare","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint96","name":"_twitter_id","type":"uint96"}],"name":"resolveToTwitterID","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"tempRequestAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tempTwitter_id","outputs":[{"internalType":"uint96","name":"","type":"uint96"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint96","name":"","type":"uint96"}],"name":"twitterIDaddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]

const contractDefined_JS = new web3.eth.Contract(contractABI_JS, contractAddress_JS)

const twitterID = 20
const twitterRequestData = contractDefined_JS.methods.requestTweetAddressCompare(twitterID).encodeABI()

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

  // 3. execute the LYX transfer via the Key Manager
  const executeTx = await myKM.methods.execute(transferLYXPayload).send({
    from: myEOA.address,
    gasLimit: 300000,
  });

  console.log(executeTx)

}

main()
