const { expect } = require("chai");
const { ethers } = require("hardhat");
const provider = ethers.provider;
const network = ethers.network;

var chai = require("chai");
const BN = require("bn.js");
chai.use(require("chai-bn")(BN));

describe("ElectricKeeper Unit Tests:", function () {
  let ContractSource;
  let ContractDeployed;
  let owner;
  let buyer1;
  let buyer2;
  let addrs;

  beforeEach(async function () {
    ContractSource = await ethers.getContractFactory("MockTwitterNameSpace");
    ContractDeployed = await ContractSource.deploy();
    [owner, buyer1, buyer2, ...addrs] = await ethers.getSigners();
  });

  describe("constructor()", function () {
    // it("relayAddress is equal to default ethers.getSigners() address.", async function () {
    //   expect(await ContractDeployed.relayAddress()).to.equal(owner.address);
    // });
    it("tempTwitter_id 0.", async function () {
      expect(await ContractDeployed.tempTwitter_id()).to.equal(0);
    });
    it("tempRequestAddress is address(0).", async function () {
      expect(await ContractDeployed.tempRequestAddress()).to.equal("0x0000000000000000000000000000000000000000");
    });
    it("twitterIDaddress(20) is address(0).", async function () {
      expect(await ContractDeployed.twitterIDaddress(20)).to.equal("0x0000000000000000000000000000000000000000");
    });
    it("addressTwitterID(owner.address) is 0.", async function () {
      expect(await ContractDeployed.addressTwitterID(owner.address)).to.equal(0);
    });
    it("_addressFromTweetMatches is 0.", async function () {
      expect(await ContractDeployed._addressFromTweetMatches()).to.equal(0);
    });

  });



  describe("mockRequestAnswer", function () {
    it("_addressFromTweetMatches", async function () {
      const transactionCallAPI = await ContractDeployed.mockRequestAnswer(1);
      const tx_receiptCallAPI = await transactionCallAPI.wait();
      expect(await ContractDeployed._addressFromTweetMatches()).to.equal(1);
    });
  });

  describe("requestTweetAddressCompare()", function () {
    it("Storge address and twitter_id stored", async function () {
      const transactionCallAPI = await ContractDeployed.requestTweetAddressCompare(20);
      const tx_receiptCallAPI = await transactionCallAPI.wait();
      expect(await ContractDeployed.tempRequestAddress()).to.equal(owner.address);
      expect(await ContractDeployed.tempTwitter_id()).to.equal(20);
    });
    it("Revert if storage slots filled waiting for oracle request", async function () {
      const transactionCallAPI = await ContractDeployed.requestTweetAddressCompare(20);
      const tx_receiptCallAPI = await transactionCallAPI.wait();
      await expect(
        ContractDeployed.requestTweetAddressCompare(20)
      ).to.be.revertedWith("REQUEST ALREADY ACTIVE!");
    });

  });

  describe("mockFulfillLogic", function () {
    it("Empty mapping if return is 2", async function () {
      const transactionCallAPI = await ContractDeployed.mockRequestAnswer(2);
      const tx_receiptCallAPI = await transactionCallAPI.wait();
      expect(await ContractDeployed._addressFromTweetMatches()).to.equal(2);

      const transactionCallAPI2 = await ContractDeployed.requestTweetAddressCompare(20);
      const tx_receiptCallAPI2 = await transactionCallAPI2.wait();
      expect(await ContractDeployed.tempRequestAddress()).to.equal(owner.address);
      expect(await ContractDeployed.tempTwitter_id()).to.equal(20);

      const transactionCallAPI3 = await ContractDeployed.mockFulfillLogic();
      const tx_receiptCallAPI3 = await transactionCallAPI3.wait();

      expect(await ContractDeployed.twitterIDaddress(20)).to.equal("0x0000000000000000000000000000000000000000");
      expect(await ContractDeployed.addressTwitterID(owner.address)).to.equal(0);

      expect(await ContractDeployed.tempTwitter_id()).to.equal(0);
      expect(await ContractDeployed.tempRequestAddress()).to.equal("0x0000000000000000000000000000000000000000");

    });
    it("Filled mapping if return is 1", async function () {
      const transactionCallAPI = await ContractDeployed.mockRequestAnswer(1);
      const tx_receiptCallAPI = await transactionCallAPI.wait();
      expect(await ContractDeployed._addressFromTweetMatches()).to.equal(1);

      const transactionCallAPI2 = await ContractDeployed.requestTweetAddressCompare(20);
      const tx_receiptCallAPI2 = await transactionCallAPI2.wait();
      expect(await ContractDeployed.tempRequestAddress()).to.equal(owner.address);
      expect(await ContractDeployed.tempTwitter_id()).to.equal(20);

      const transactionCallAPI3 = await ContractDeployed.mockFulfillLogic();
      const tx_receiptCallAPI3 = await transactionCallAPI3.wait();

      expect(await ContractDeployed.twitterIDaddress(20)).to.equal(owner.address);
      expect(await ContractDeployed.addressTwitterID(owner.address)).to.equal(20);

      expect(await ContractDeployed.tempTwitter_id()).to.equal(0);
      expect(await ContractDeployed.tempRequestAddress()).to.equal("0x0000000000000000000000000000000000000000");

    });
    it("If new address claims the same twitter_id, remove old address => twitter_id", async function () {
      const transactionCallAPI = await ContractDeployed.mockRequestAnswer(1);
      const tx_receiptCallAPI = await transactionCallAPI.wait();
      expect(await ContractDeployed._addressFromTweetMatches()).to.equal(1);

      const transactionCallAPI2 = await ContractDeployed.requestTweetAddressCompare(20);
      const tx_receiptCallAPI2 = await transactionCallAPI2.wait();
      expect(await ContractDeployed.tempRequestAddress()).to.equal(owner.address);
      expect(await ContractDeployed.tempTwitter_id()).to.equal(20);

      const transactionCallAPI3 = await ContractDeployed.mockFulfillLogic();
      const tx_receiptCallAPI3 = await transactionCallAPI3.wait();

      expect(await ContractDeployed.twitterIDaddress(20)).to.equal(owner.address);
      expect(await ContractDeployed.addressTwitterID(owner.address)).to.equal(20);

      expect(await ContractDeployed.tempTwitter_id()).to.equal(0);
      expect(await ContractDeployed.tempRequestAddress()).to.equal("0x0000000000000000000000000000000000000000");

      const transactionCallAPI4 = await ContractDeployed.connect(buyer1).requestTweetAddressCompare(20);
      const tx_receiptCallAPI4 = await transactionCallAPI4.wait();
      expect(await ContractDeployed.tempRequestAddress()).to.equal(buyer1.address);
      expect(await ContractDeployed.tempTwitter_id()).to.equal(20);

      const transactionCallAPI5 = await ContractDeployed.mockFulfillLogic();
      const tx_receiptCallAPI5 = await transactionCallAPI5.wait();

      expect(await ContractDeployed.addressTwitterID(owner.address)).to.equal(0);

      expect(await ContractDeployed.addressTwitterID(buyer1.address)).to.equal(20);
      expect(await ContractDeployed.twitterIDaddress(20)).to.equal(buyer1.address);

      expect(await ContractDeployed.tempTwitter_id()).to.equal(0);
      expect(await ContractDeployed.tempRequestAddress()).to.equal("0x0000000000000000000000000000000000000000");
    });

  });

  describe("resolveToTwitterID", function () {

    it("Revert if storage slots filled waiting for oracle request", async function () {
      await expect(
        ContractDeployed.resolveToTwitterID(20)
      ).to.be.revertedWith("You have not verified this Twitter ID with your account yet.");
    });
    it("Filled mapping if return is 1", async function () {
      const transactionCallAPI = await ContractDeployed.mockRequestAnswer(1);
      const tx_receiptCallAPI = await transactionCallAPI.wait();
      expect(await ContractDeployed._addressFromTweetMatches()).to.equal(1);

      const transactionCallAPI2 = await ContractDeployed.requestTweetAddressCompare(20);
      const tx_receiptCallAPI2 = await transactionCallAPI2.wait();
      expect(await ContractDeployed.tempRequestAddress()).to.equal(owner.address);
      expect(await ContractDeployed.tempTwitter_id()).to.equal(20);

      const transactionCallAPI3 = await ContractDeployed.mockFulfillLogic();
      const tx_receiptCallAPI3 = await transactionCallAPI3.wait();

      expect(await ContractDeployed.twitterIDaddress(20)).to.equal(owner.address);
      expect(await ContractDeployed.addressTwitterID(owner.address)).to.equal(20);

      expect(await ContractDeployed.tempTwitter_id()).to.equal(0);
      expect(await ContractDeployed.tempRequestAddress()).to.equal("0x0000000000000000000000000000000000000000");

      const transactionCallAPI4 = await ContractDeployed.requestTweetAddressCompare(12);
      const tx_receiptCallAPI4 = await transactionCallAPI4.wait();
      expect(await ContractDeployed.tempRequestAddress()).to.equal(owner.address);
      expect(await ContractDeployed.tempTwitter_id()).to.equal(12);

      const transactionCallAPI5 = await ContractDeployed.mockFulfillLogic();
      const tx_receiptCallAPI5 = await transactionCallAPI5.wait();

      expect(await ContractDeployed.twitterIDaddress(12)).to.equal(owner.address);
      expect(await ContractDeployed.addressTwitterID(owner.address)).to.equal(12);

      expect(await ContractDeployed.tempTwitter_id()).to.equal(0);
      expect(await ContractDeployed.tempRequestAddress()).to.equal("0x0000000000000000000000000000000000000000");

      const transactionCallAPI6 = await ContractDeployed.resolveToTwitterID(20);
      const tx_receiptCallAPI6 = await transactionCallAPI6.wait();

      expect(await ContractDeployed.addressTwitterID(owner.address)).to.equal(20);
      expect(await ContractDeployed.twitterIDaddress(20)).to.equal(owner.address);
      expect(await ContractDeployed.twitterIDaddress(12)).to.equal(owner.address);

    });

  });

});
