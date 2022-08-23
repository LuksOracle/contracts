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


       //  describe("ownerWithdrawPool", function () {
       //      it("not owner", async function () {
       //        await expect(
       //          ContractDeployed.connect(addr1).ownerWithdrawPool()
       //             ).to.be.revertedWith("Only the Owner can access this function.");
       //      });
       //      it("pool must exist", async function () {
       //        await expect(
       //          ContractDeployed.ownerWithdrawPool()
       //             ).to.be.revertedWith("Pool does not exist yet.");
       //      });
       //      it("constant product not matched", async function () {
       //        await ERC20Deployed.approve(ContractDeployed.address,4)
       //        await ContractDeployed.createMaticLinkPool(4 , {value: 4});
       //        await ContractDeployed.ownerWithdrawPool()
       //        poolMatic = await ContractDeployed.poolMaticBalance();
       //        poolLink = await ContractDeployed.poolLinkBalance();
       //        expect(poolMatic*poolLink == 0)
       //      });
       //   });
       //
       //   describe("swapMATICforLINK", function () {
       //     it("pool must exist", async function () {
       //       await expect(
       //         ContractDeployed.swapMATICforLINK({value: 4})
       //            ).to.be.revertedWith("Pool does not exist yet.");
       //     });
       //     it("unbalanced swap", async function () {
       //       await ERC20Deployed.approve(ContractDeployed.address,4)
       //       await ContractDeployed.createMaticLinkPool(4 , {value: 4});
       //       await expect(
       //         ContractDeployed.connect(addr1).swapMATICforLINK({value: 3})
       //       ).to.be.revertedWith("Matic deposit will not balance pool!");
       //     });
       //     it("valid swap", async function () {
       //       await ERC20Deployed.approve(ContractDeployed.address,4)
       //       await ContractDeployed.createMaticLinkPool(4 , {value: 4});
       //       linkToReceive = await ContractDeployed.linkToReceive(4);
       //       expect(linkToReceive == 2)
       //       await ContractDeployed.connect(addr1).swapMATICforLINK({value: 4})
       //       poolMatic = await ContractDeployed.poolMaticBalance();
       //       poolLink = await ContractDeployed.poolLinkBalance();
       //       expect(poolMatic*poolLink == ContractDeployed.constantProduct())
       //     });
       //    });
       //
       //    describe("swapLINKforMATIC", function () {
       //      it("pool must exist", async function () {
       //        await expect(
       //          ContractDeployed.swapLINKforMATIC(4)
       //             ).to.be.revertedWith("Pool does not exist yet.");
       //      });
       //      it("valid two swaps", async function () {
       //        await ERC20Deployed.approve(ContractDeployed.address,4)
       //        await ContractDeployed.createMaticLinkPool(4 , {value: 4});
       //        await ContractDeployed.connect(addr1).swapMATICforLINK({value: 4})
       //        //Next swap.
       //        await ERC20Deployed.connect(addr1).approve(ContractDeployed.address,2)
       //        await ContractDeployed.connect(addr1).swapLINKforMATIC(2)
       //        poolMatic = await ContractDeployed.poolMaticBalance();
       //        poolLink = await ContractDeployed.poolLinkBalance();
       //        expect(poolMatic*poolLink == ContractDeployed.constantProduct())
       //      });
       //      it("unbalanced swap", async function () {
       //        await ERC20Deployed.approve(ContractDeployed.address,4)
       //        await ContractDeployed.createMaticLinkPool(4 , {value: 4});
       //        await ContractDeployed.connect(addr1).swapMATICforLINK({value: 4})
       //        //Next swap.
       //        await ERC20Deployed.connect(addr1).approve(ContractDeployed.address,1)
       //        await expect(
       //          ContractDeployed.connect(addr1).swapLINKforMATIC(1)
       //        ).to.be.revertedWith("Link deposit will not balance pool!");
       //      });
       //     });

});
