const { expect } = require('chai');
const LinkTokenABI = '[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transferAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]'
const TwitterNameSpaceABI =
[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkFulfilled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkRequested","type":"event"},{"anonymous":false,"inputs":[],"name":"tweetRequestEvent","type":"event"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"addressTwitterID","outputs":[{"internalType":"uint96","name":"","type":"uint96"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_requestId","type":"bytes32"},{"internalType":"uint256","name":"_addressFromTweetMatches","type":"uint256"}],"name":"fulfillTweetAddressCompare","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint96","name":"twitter_id_Request","type":"uint96"}],"name":"requestTweetAddressCompare","outputs":[{"internalType":"bytes32","name":"requestId","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint96","name":"_twitter_id","type":"uint96"}],"name":"resolveToTwitterID","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"tempRequestAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tempTwitter_id","outputs":[{"internalType":"uint96","name":"","type":"uint96"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint96","name":"","type":"uint96"}],"name":"twitterIDaddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]

var chai = require('chai');
const BN = require('bn.js');
chai.use(require('chai-bn')(BN));

  describe('Twitter Test', async function () {
    it('Chainlink API returns value for Twitter response.', async () => {
      const accounts = await ethers.getSigners()
      const signer = accounts[0]
      const TwitterNameSpaceContract = new ethers.Contract('0x5b1a5a842eB0ac44C0bC831a1233d0ac3b321eA3', TwitterNameSpaceABI, signer)
      const linkTokenContract = new ethers.Contract('0xbFB26279a9D28CeC1F781808Da89eFbBfE2c4268', LinkTokenABI, signer)
      const transferTransaction = await linkTokenContract.transfer("0x5b1a5a842eB0ac44C0bC831a1233d0ac3b321eA3",'10000000000000000')
      console.log(transferTransaction)
      await transferTransaction.wait()
      console.log('transfer_hash:' + transferTransaction.hash)
      const apiCallTransaction = await TwitterNameSpaceContract.requestTweetAddressCompare(1438606749389541377)
      await apiCallTransaction.wait()
      console.log('API_call_hash:' + apiCallTransaction.hash)
      await new Promise(resolve => setTimeout(resolve, 30000))
      const responseValue = await TwitterNameSpaceContract.addressTwitterID("0xc1202e7d42655F23097476f6D48006fE56d38d4f")
      console.log("Response: ", new ethers.BigNumber.from(responseValue._hex).toString())
      expect(new ethers.BigNumber.from(responseValue._hex).toString()).to.be.a.bignumber.that.is.greaterThan(new ethers.BigNumber.from(0).toString())

    })

  })
