const Web3 = require('web3');
const UniversalProfile = require('@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json');
const KeyManager = require('@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json');

const web3 = new Web3('https://rpc.l16.lukso.network');
const myUPAddress = "0x8414F1BaC5fCdA2C274A4a78D0D62109f1Cbb6C8"

// const web3 = new Web3('https://rpc.l14.lukso.network');
// const myUPAddress = "0xfE854EB335786037aDb33C36936f679CA127C3CD"

const PRIVATE_KEY = "0x" + process.env.devTestnetPrivateKey; // add the private key of your EOA here (created in Step 1)
const myEOA = web3.eth.accounts.wallet.add(PRIVATE_KEY); // amount of LYX we want to transfer

async function myFunction() {

  // 1. instantiate your contracts
  const myUP = new web3.eth.Contract(UniversalProfile.abi, myUPAddress);

  // the KeyManager is the owner of the Universal Profile
  // so we can call the owner() function to obtain the KeyManager's address
  const owner = await myUP.methods.owner().call();
  console.log(owner)

  const myKM = new web3.eth.Contract(KeyManager.abi, owner);

  const OPERATION_CALL = 0;
  const recipient = '0x66C1d8A5ee726b545576A75380391835F8AAA43c'; // address the recipient (any address, including an other UP)
  const amount = web3.utils.toWei('2');
  // payload executed at the target (here nothing, just a plain LYX transfer)
  const data = '0x';

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

myFunction()
