const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Faucet Tests:", function () {

      let ERC20;
      let ERC20Deployed;
      let Contract;
      let ContractDeployed;
      let owner;
      let addr1;
      let addr2;
      let addrs;

      beforeEach(async function () {
        ERC20 = await ethers.getContractFactory("ChainLink");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        ERC20Deployed = await ERC20.deploy();
        Contract = await ethers.getContractFactory("mockFaucetLINK");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        ContractDeployed = await Contract.deploy(ERC20Deployed.address);
      });

      describe("Constructor", function () {
          it("Owner has not withdrawn", async function () {
            expect(await ContractDeployed.userPreviousWithdrawTime(owner.address)).to.equal(0);
          });
          it("relayAddress set", async function () {
            expect(await ContractDeployed.relayAddress()).to.equal(owner.address);
          });
          it("Contract has no LINK yet", async function () {
            expect(await ERC20Deployed.balanceOf(ContractDeployed.address)).to.equal(0);
          });

       });

       describe("withdrawDirect", function () {
           it("Revert if no LINK in faucet", async function () {
             await expect(
               ContractDeployed.withdrawDirect()
             ).to.be.revertedWith("Faucet does not have any more LINK (has less than 20 LINK currently).");
           });
           it("User gets 20 LINK, then gets reverted if asks again if 12 hours have not passed.", async function () {

             const transactionCallAPI = await ERC20Deployed.transfer(ContractDeployed.address, "40000000000000000000");
             const tx_receiptCallAPI = await transactionCallAPI.wait();
             expect(await ERC20Deployed.balanceOf(ContractDeployed.address)).to.equal("40000000000000000000");

             const transactionCallAPI2 = await ContractDeployed.connect(addr1).withdrawDirect();
             const tx_receiptCallAPI2 = await transactionCallAPI2.wait();
             expect(await ERC20Deployed.balanceOf(ContractDeployed.address)).to.equal("20000000000000000000");
             expect(await ERC20Deployed.balanceOf(addr1.address)).to.equal("20000000000000000000");

             await expect(
               ContractDeployed.connect(addr1).withdrawDirect()
             ).to.be.revertedWith("Current user must wait 12 hours for faucet cooldown.");

           });

        });

        describe("withdrawRelay", function () {
            it("Revert if relayAddress is not msg.sender", async function () {
              await expect(
                ContractDeployed.connect(addr1).withdrawRelay(addr1.address)
              ).to.be.revertedWith("Only the relay address can access this function.");
            });
            it("Revert if no LINK in faucet", async function () {
              await expect(
                ContractDeployed.withdrawRelay(addr1.address)
              ).to.be.revertedWith("Faucet does not have any more LINK (has less than 20 LINK currently).");
            });
            it("User gets 20 LINK, then gets reverted if asks again if 12 hours have not passed.", async function () {

              const transactionCallAPI = await ERC20Deployed.transfer(ContractDeployed.address, "40000000000000000000");
              const tx_receiptCallAPI = await transactionCallAPI.wait();
              expect(await ERC20Deployed.balanceOf(ContractDeployed.address)).to.equal("40000000000000000000");

              const transactionCallAPI2 = await ContractDeployed.withdrawRelay(addr1.address);
              const tx_receiptCallAPI2 = await transactionCallAPI2.wait();
              expect(await ERC20Deployed.balanceOf(ContractDeployed.address)).to.equal("20000000000000000000");
              expect(await ERC20Deployed.balanceOf(addr1.address)).to.equal("20000000000000000000");

              await expect(
                ContractDeployed.withdrawRelay(addr1.address)
              ).to.be.revertedWith("Current user must wait 12 hours for faucet cooldown.");

            });

         });

});
