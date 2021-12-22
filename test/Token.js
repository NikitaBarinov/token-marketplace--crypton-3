const Web3 = require('web3');
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('Token contract', () => {
    let Token, token, Dao, dao, chairPerson, owner, addr1, addr2;
    // AccessControl roles in bytes32 string
    // DEFAULT_ADMIN_ROLE, MINTER_ROLE, BURNER_ROLE
    const adminRole = ethers.constants.HashZero;
    const minterRole =
    "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
    const burnerRole =
    "0x51f4231475d91734c657e212cfb2e9728a863d53c9057d6ce6ca203d6e5cfd5d";

    const zero_address = "0x0000000000000000000000000000000000000000"
    
    beforeEach(async () => {
        [owner, chairPerson, addr1, addr2, _] = await ethers.getSigners();
        Token = await ethers.getContractFactory('ACDM');
        token = await Token.connect(owner).deploy();
        await token.deployed();

        TradingFloor = await ethers.getContractFactory('TradingFloor');
        tradingFloor = await TradingFloor.deploy(token.address);
        await tradingFloor.deployed();
        
        token.connect(owner).setRoleForTradingFloor(tradingFloor.address);
    });

    describe('Deployment', () => {
        it('Should set admin role for trading floor', async () => {
            expect(await token.hasRole(adminRole,tradingFloor.address)).to.equal(true);
        });

        it('Should set minter role for trading floor', async () => {
            expect(await token.hasRole(minterRole,tradingFloor.address)).to.equal(true);
        });

        it('Should set burner role for trading floor', async () => {
            expect(await token.hasRole(burnerRole,tradingFloor.address)).to.equal(true);
        });

        it('Should set right trading floor address', async () => {
            expect(tradingFloor.address).to.equal(await tradingFloor.getTradingFloorAddress());
        });
    });

    describe('Transactions', () => {
        it('Registration: should register user without refers', async () => {
            await tradingFloor.connect(addr1)
                .registration(
                    zero_address,
                    zero_address,
                    {
                         value: ethers.utils.parseEther("20")
                    }
                );

            const addr1Balance = await tradingFloor.balanceOfETH(addr1.address);
            const addr1Refers = await tradingFloor.getRefer(addr1.address);
        
            expect(addr1Refers.firstRefer).to.equal(tradingFloor.address);
            expect(addr1Refers.secondRefer).to.equal(tradingFloor.address);
            expect(addr1Balance).to.equal("20000000000000000000");
        });

        it('Registration: should register user with first refers', async () => {
            await tradingFloor.connect(addr2)
                .registration(
                    zero_address,
                    zero_address,
                    {
                         value: ethers.utils.parseEther("20")
                    }
                );
            await tradingFloor.connect(owner)
                .registration(
                    addr2.address,
                    zero_address,
                    {
                         value: ethers.utils.parseEther("20")
                    }
                );

            const ownerBalance = await tradingFloor.balanceOfETH(owner.address);
            const ownerRefers = await tradingFloor.getRefer(owner.address);
        
            expect(ownerRefers.firstRefer).to.equal(addr2.address);
            expect(ownerRefers.secondRefer).to.equal(tradingFloor.address);
            expect(ownerBalance).to.equal("20000000000000000000");
        });

        it('Registration: should register user with second refers', async () => {
            await tradingFloor.connect(addr2)
                .registration(
                    zero_address,
                    zero_address,
                    {
                         value: ethers.utils.parseEther("20")
                    }
                );
            await tradingFloor.connect(owner)
                .registration(
                    zero_address,
                    addr2.address,
                    {
                         value: ethers.utils.parseEther("20")
                    }
                );

            const ownerBalance = await tradingFloor.balanceOfETH(owner.address);
            const ownerRefers = await tradingFloor.getRefer(owner.address);
        
            expect(ownerRefers.firstRefer).to.equal(tradingFloor.address);
            expect(ownerRefers.secondRefer).to.equal(addr2.address);
            expect(ownerBalance).to.equal("20000000000000000000");
        });

        it('Registration: should register user with 2 refers', async () => {
            await tradingFloor.connect(addr1)
                .registration(
                    zero_address,
                    zero_address,
                    {
                         value: ethers.utils.parseEther("20")
                    }
                );

            await tradingFloor.connect(addr2)
            .registration(
                zero_address,
                zero_address,
                {
                        value: ethers.utils.parseEther("20")
                }
            );

            await tradingFloor.connect(owner)
                .registration(
                    addr1.address,
                    addr2.address,
                    {
                         value: ethers.utils.parseEther("20")
                    }
                );

            const ownerBalance = await tradingFloor.balanceOfETH(owner.address);
            const ownerRefers = await tradingFloor.getRefer(owner.address);
        
            expect(ownerRefers.firstRefer).to.equal(addr1.address);
            expect(ownerRefers.secondRefer).to.equal(addr2.address);
            expect(ownerBalance).to.equal("20000000000000000000");
        });
        

        it("Registration: should reverted if user is already registered", async () => {
            await tradingFloor.connect(addr1)
            .registration(
                zero_address,
                zero_address,
                {
                     value: ethers.utils.parseEther("20")
                }
            );
        
            await expect(
                tradingFloor.connect(addr1)
                .registration(
                    zero_address,
                    zero_address,
                    {
                         value: ethers.utils.parseEther("20")
                    }
                ))
            .to.be.revertedWith("User is already registered")
        });

        it("Registration: should reverted if second refer is not registered", async () => {
            await expect(
                tradingFloor.connect(addr1)
                .registration(
                    addr1.address,
                    zero_address,
                    {
                         value: ethers.utils.parseEther("20")
                    }
                ))
            .to.be.revertedWith("User not registered")
        });

        it("Registration: should reverted if second refer is not registered", async () => {
            await expect(
                tradingFloor.connect(addr1)
                .registration(
                    zero_address,
                    addr2.address,
                    {
                         value: ethers.utils.parseEther("20")
                    }
                ))
            .to.be.revertedWith("User not registered")
        });

        it("Registration: should emit 'UserIsRegistrated'", async () => {
        await expect(
            tradingFloor.connect(addr1)
            .registration(
                zero_address,
                zero_address,
                {
                     value: ethers.utils.parseEther("20")
                }
            ))
        .to.emit(tradingFloor, "UserIsRegistrated")
            .withArgs(
                addr1.address,
                tradingFloor.address,
                tradingFloor.address
            )
        });
        

        
        // it('Should deposit 500 tokens on owner address and 300 on addr1', async () => {
        //     await token.connect(owner).transfer(addr1.address, 305);

        //     await dao.connect(owner).deposit(500);
        //     await dao.connect(addr1).deposit(300);
            
        //     const ownerBalance = await dao.balanceOf(owner.address);
        //     const addr1Balance = await dao.balanceOf(addr1.address);
            
        //     expect(ownerBalance).to.equal("500");
        //     expect(addr1Balance).to.equal("300");
        // });

        

        // it("Add proposal: should reverted if not token holder", async () => {
        //  await expect(
        //     dao.connect(owner).
        //         addProposal(
        //             token.address,
        //             "test proposal",
        //             TransactonByteCode))
        //     .to.be.revertedWith("Insufficens funds")
        // });

        // it("Add proposal: should emit 'ProposalCreated'", async () => {
        //     await dao.connect(owner).deposit(500);
        //     await expect(
        //        dao.connect(owner).
        //            addProposal(
        //                token.address,
        //                "test proposal",
        //                TransactonByteCode))
        //     .to.emit(dao, "ProposalCreated")
        //        .withArgs(
        //             token.address,
        //             TransactonByteCode,
        //             "test proposal",
        //             (Number(await dao.getBlockTimeStamp())) + Number(await dao.debatingPeriod())
        //        )
        //    });
    });
});


