const { expect } = require("chai");
const { ethers } = require("hardhat");
const provider = ethers.provider;
const network = ethers.network;

var chai = require("chai");
const BN = require("bn.js");
chai.use(require("chai-bn")(BN));

describe("ElectricKeeper Unit Tests:", function () {
  let ElectricKeeper;
  let electricKeeperDeployed;
  let BuyDemoEightMinutes;
  let BuyDemoEightMinutesDeployed;
  let owner;
  let buyer1;
  let buyer2;
  let addrs;

  beforeEach(async function () {
    ElectricKeeper = await ethers.getContractFactory("MockTwitterNameSpace");
    electricKeeperDeployed = await ElectricKeeper.deploy();
    [owner, buyer1, buyer2, ...addrs] = await ethers.getSigners();
  });

  describe("constructor()", function () {
    // it("relayAddress is equal to default ethers.getSigners() address.", async function () {
    //   expect(await electricKeeperDeployed.relayAddress()).to.equal(owner.address);
    // });
    it("tempTwitter_id 0.", async function () {
      expect(await electricKeeperDeployed.tempTwitter_id()).to.equal(0);
    });
    it("tempRequestAddress is address(0).", async function () {
      expect(await electricKeeperDeployed.tempRequestAddress()).to.equal("0x0000000000000000000000000000000000000000");
    });
    it("twitterIDaddress(20) is address(0).", async function () {
      expect(await electricKeeperDeployed.twitterIDaddress(20)).to.equal("0x0000000000000000000000000000000000000000");
    });
    it("addressTwitterID(owner.address) is 0.", async function () {
      expect(await electricKeeperDeployed.addressTwitterID(owner.address)).to.equal(0);
    });
    it("_addressFromTweetMatches is 0.", async function () {
      expect(await electricKeeperDeployed._addressFromTweetMatches()).to.equal(0);
    });

  });



  describe("mockRequestAnswer", function () {
    it("_addressFromTweetMatches", async function () {
      const transactionCallAPI = await electricKeeperDeployed.mockRequestAnswer(1);
      const tx_receiptCallAPI = await transactionCallAPI.wait();
      expect(await electricKeeperDeployed._addressFromTweetMatches()).to.equal(1);
    });
  });

  describe("requestTweetAddressCompare()", function () {
    it("Storge address and twitter_id stored", async function () {
      const transactionCallAPI = await electricKeeperDeployed.requestTweetAddressCompare(20);
      const tx_receiptCallAPI = await transactionCallAPI.wait();
      expect(await electricKeeperDeployed.tempRequestAddress()).to.equal(owner.address);
      expect(await electricKeeperDeployed.tempTwitter_id()).to.equal(20);
    });
    it("Revert if storage slots filled waiting for oracle request", async function () {
      const transactionCallAPI = await electricKeeperDeployed.requestTweetAddressCompare(20);
      const tx_receiptCallAPI = await transactionCallAPI.wait();
      await expect(
        electricKeeperDeployed.requestTweetAddressCompare(20)
      ).to.be.revertedWith("REQUEST ALREADY ACTIVE!");
    });

  });

  describe("mockFulfillLogic", function () {
    it("Empty mapping if return is 2", async function () {
      const transactionCallAPI = await electricKeeperDeployed.mockRequestAnswer(2);
      const tx_receiptCallAPI = await transactionCallAPI.wait();
      expect(await electricKeeperDeployed._addressFromTweetMatches()).to.equal(2);

      const transactionCallAPI2 = await electricKeeperDeployed.requestTweetAddressCompare(20);
      const tx_receiptCallAPI2 = await transactionCallAPI2.wait();
      expect(await electricKeeperDeployed.tempRequestAddress()).to.equal(owner.address);
      expect(await electricKeeperDeployed.tempTwitter_id()).to.equal(20);

      const transactionCallAPI3 = await electricKeeperDeployed.mockFulfillLogic();
      const tx_receiptCallAPI3 = await transactionCallAPI3.wait();

      expect(await electricKeeperDeployed.twitterIDaddress(20)).to.equal("0x0000000000000000000000000000000000000000");
      expect(await electricKeeperDeployed.addressTwitterID(owner.address)).to.equal(0);

      expect(await electricKeeperDeployed.tempTwitter_id()).to.equal(0);
      expect(await electricKeeperDeployed.tempRequestAddress()).to.equal("0x0000000000000000000000000000000000000000");

    });
    it("Filled mapping if return is 1", async function () {
      const transactionCallAPI = await electricKeeperDeployed.mockRequestAnswer(1);
      const tx_receiptCallAPI = await transactionCallAPI.wait();
      expect(await electricKeeperDeployed._addressFromTweetMatches()).to.equal(1);

      const transactionCallAPI2 = await electricKeeperDeployed.requestTweetAddressCompare(20);
      const tx_receiptCallAPI2 = await transactionCallAPI2.wait();
      expect(await electricKeeperDeployed.tempRequestAddress()).to.equal(owner.address);
      expect(await electricKeeperDeployed.tempTwitter_id()).to.equal(20);

      const transactionCallAPI3 = await electricKeeperDeployed.mockFulfillLogic();
      const tx_receiptCallAPI3 = await transactionCallAPI3.wait();

      expect(await electricKeeperDeployed.twitterIDaddress(20)).to.equal(owner.address);
      expect(await electricKeeperDeployed.addressTwitterID(owner.address)).to.equal(20);

      expect(await electricKeeperDeployed.tempTwitter_id()).to.equal(0);
      expect(await electricKeeperDeployed.tempRequestAddress()).to.equal("0x0000000000000000000000000000000000000000");

    });
    it("If new address claims the same twitter_id, remove old address => twitter_id", async function () {
      const transactionCallAPI = await electricKeeperDeployed.mockRequestAnswer(1);
      const tx_receiptCallAPI = await transactionCallAPI.wait();
      expect(await electricKeeperDeployed._addressFromTweetMatches()).to.equal(1);

      const transactionCallAPI2 = await electricKeeperDeployed.requestTweetAddressCompare(20);
      const tx_receiptCallAPI2 = await transactionCallAPI2.wait();
      expect(await electricKeeperDeployed.tempRequestAddress()).to.equal(owner.address);
      expect(await electricKeeperDeployed.tempTwitter_id()).to.equal(20);

      const transactionCallAPI3 = await electricKeeperDeployed.mockFulfillLogic();
      const tx_receiptCallAPI3 = await transactionCallAPI3.wait();

      expect(await electricKeeperDeployed.twitterIDaddress(20)).to.equal(owner.address);
      expect(await electricKeeperDeployed.addressTwitterID(owner.address)).to.equal(20);

      expect(await electricKeeperDeployed.tempTwitter_id()).to.equal(0);
      expect(await electricKeeperDeployed.tempRequestAddress()).to.equal("0x0000000000000000000000000000000000000000");

      const transactionCallAPI4 = await electricKeeperDeployed.connect(buyer1).requestTweetAddressCompare(20);
      const tx_receiptCallAPI4 = await transactionCallAPI4.wait();
      expect(await electricKeeperDeployed.tempRequestAddress()).to.equal(buyer1.address);
      expect(await electricKeeperDeployed.tempTwitter_id()).to.equal(20);

      const transactionCallAPI5 = await electricKeeperDeployed.mockFulfillLogic();
      const tx_receiptCallAPI5 = await transactionCallAPI5.wait();

      expect(await electricKeeperDeployed.addressTwitterID(owner.address)).to.equal(0);

      expect(await electricKeeperDeployed.addressTwitterID(buyer1.address)).to.equal(20);
      expect(await electricKeeperDeployed.twitterIDaddress(20)).to.equal(buyer1.address);

      expect(await electricKeeperDeployed.tempTwitter_id()).to.equal(0);
      expect(await electricKeeperDeployed.tempRequestAddress()).to.equal("0x0000000000000000000000000000000000000000");
    });

  });

  describe("resolveToTwitterID", function () {

    it("Revert if storage slots filled waiting for oracle request", async function () {
      await expect(
        electricKeeperDeployed.resolveToTwitterID(20)
      ).to.be.revertedWith("You have not verified this Twitter ID with your account yet.");
    });
    it("Filled mapping if return is 1", async function () {
      const transactionCallAPI = await electricKeeperDeployed.mockRequestAnswer(1);
      const tx_receiptCallAPI = await transactionCallAPI.wait();
      expect(await electricKeeperDeployed._addressFromTweetMatches()).to.equal(1);

      const transactionCallAPI2 = await electricKeeperDeployed.requestTweetAddressCompare(20);
      const tx_receiptCallAPI2 = await transactionCallAPI2.wait();
      expect(await electricKeeperDeployed.tempRequestAddress()).to.equal(owner.address);
      expect(await electricKeeperDeployed.tempTwitter_id()).to.equal(20);

      const transactionCallAPI3 = await electricKeeperDeployed.mockFulfillLogic();
      const tx_receiptCallAPI3 = await transactionCallAPI3.wait();

      expect(await electricKeeperDeployed.twitterIDaddress(20)).to.equal(owner.address);
      expect(await electricKeeperDeployed.addressTwitterID(owner.address)).to.equal(20);

      expect(await electricKeeperDeployed.tempTwitter_id()).to.equal(0);
      expect(await electricKeeperDeployed.tempRequestAddress()).to.equal("0x0000000000000000000000000000000000000000");

      const transactionCallAPI4 = await electricKeeperDeployed.requestTweetAddressCompare(12);
      const tx_receiptCallAPI4 = await transactionCallAPI4.wait();
      expect(await electricKeeperDeployed.tempRequestAddress()).to.equal(owner.address);
      expect(await electricKeeperDeployed.tempTwitter_id()).to.equal(12);

      const transactionCallAPI5 = await electricKeeperDeployed.mockFulfillLogic();
      const tx_receiptCallAPI5 = await transactionCallAPI5.wait();

      expect(await electricKeeperDeployed.twitterIDaddress(12)).to.equal(owner.address);
      expect(await electricKeeperDeployed.addressTwitterID(owner.address)).to.equal(12);

      expect(await electricKeeperDeployed.tempTwitter_id()).to.equal(0);
      expect(await electricKeeperDeployed.tempRequestAddress()).to.equal("0x0000000000000000000000000000000000000000");

      const transactionCallAPI6 = await electricKeeperDeployed.resolveToTwitterID(20);
      const tx_receiptCallAPI6 = await transactionCallAPI6.wait();

      expect(await electricKeeperDeployed.addressTwitterID(owner.address)).to.equal(20);
      expect(await electricKeeperDeployed.twitterIDaddress(20)).to.equal(owner.address);
      expect(await electricKeeperDeployed.twitterIDaddress(12)).to.equal(owner.address);

    });

  });

});
