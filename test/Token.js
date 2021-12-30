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
        tradingFloor.connect(owner).tradingFloorInit();
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

        it('Should set right balance for floor address', async () => {
            expect(
                await tradingFloor.balanceOfACDM(tradingFloor.address))
            .to.equal(
                await token.balanceOf(tradingFloor.address)
            );       
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

        it('buyACDMInSale: should buy 100 ACDM', async () => {
            await tradingFloor.connect(addr1)
                .registration(
                    zero_address,
                    zero_address,
                    {
                         value: ethers.utils.parseEther("20")
                    }
                );
            
            await tradingFloor.connect(addr1).buyACDMInSale(100);

            balanceOfTradingFloorInETH = Number(await tradingFloor.balanceOfETH(tradingFloor.address));
            balanceOfAddr1InTradingFloorInETH = Number(await tradingFloor.balanceOfETH(addr1.address));
            balanceOfTradingFloorInToken = Number(await token.balanceOf(tradingFloor.address));
            balanceOfAddr1InToken = Number(await token.balanceOf(addr1.address));
            balanceOfTradingFloorInACDM = Number(await tradingFloor.balanceOfACDM(tradingFloor.address));
            balanceOfAddr1InACDM = Number(await tradingFloor.balanceOfACDM(addr1.address));
        
            expect(balanceOfTradingFloorInETH).to.equal(1000000000000000);
            expect(balanceOfAddr1InTradingFloorInETH).to.equal(19999000000000000000);
            expect(balanceOfTradingFloorInToken).to.equal(balanceOfTradingFloorInACDM);
            expect(balanceOfAddr1InToken).to.equal(balanceOfAddr1InACDM);
        });

        it("buyACDMInSale: should reverted with 'Insufficent funds'", async () => {
            await tradingFloor.connect(addr1)
                .registration(
                    zero_address,
                    zero_address,
                    {
                         value: ethers.utils.parseEther("0.005")
                    }
                );
            
           await expect(
                tradingFloor.connect(addr1)
                .buyACDMInSale(1000))
            .to.be.revertedWith("Insufficent funds")
        });

        it("buyACDMInSale: should reverted with 'Not a sale round'", async () => {
            await tradingFloor.connect(addr1)
                .registration(
                    zero_address,
                    zero_address,
                    {
                         value: ethers.utils.parseEther("25")
                    }
                );
            await tradingFloor.connect(addr1).buyACDMInSale(100);
            await tradingFloor.connect(addr1).finishRound();
            
            await expect(
                tradingFloor.connect(addr1)
                .buyACDMInSale(100))
            .to.be.revertedWith("Not a sale round")
        });
        
        it("buyACDMInSale: should emit 'ACDMBought'", async () => {
            await tradingFloor.connect(addr1)
                .registration(
                    zero_address,
                    zero_address,
                    {
                         value: ethers.utils.parseEther("25")
                    }
                );
            
                await expect(
                    tradingFloor.connect(addr1)
                    .buyACDMInSale(100))
                .to.emit(tradingFloor, "ACDMBought");
                    
        });

        it('finishRound: should finishRound', async () => {
            await tradingFloor.connect(addr1)
                .registration(
                    zero_address,
                    zero_address,
                    {
                         value: ethers.utils.parseEther("20")
                    }
                );

            await tradingFloor.connect(addr1).buyACDMInSale(100);
            await tradingFloor.connect(addr1).finishRound();

            roundInfo = await tradingFloor.getRound(0);

            roundTotalSupply = Number(roundInfo.totalSupply);
            roundSaleOrTrade = roundInfo.saleOrTrade;
            roundTradingVolume = Number(roundInfo.tradingVolumeETH);
            
            expect(roundTotalSupply).to.equal(1e23);
            expect(roundSaleOrTrade).to.equal(false);
            expect(roundTradingVolume).to.equal(1000000000000000);
        });

        it('finishRound: should finishRound', async () => {
            await tradingFloor.connect(addr1)
                .registration(
                    zero_address,
                    zero_address,
                    {
                         value: ethers.utils.parseEther("20")
                    }
                );

            await tradingFloor.connect(addr1).buyACDMInSale(100);
            await tradingFloor.connect(addr1).finishRound();

            roundInfo = await tradingFloor.getRound(0);

            roundTotalSupply = Number(roundInfo.totalSupply);
            roundSaleOrTrade = roundInfo.saleOrTrade;
            roundTradingVolume = Number(roundInfo.tradingVolumeETH);
            
            expect(roundTotalSupply).to.equal(1e23);
            expect(roundSaleOrTrade).to.equal(false);
            expect(roundTradingVolume).to.equal(1000000000000000);
        });

        it('finishRound: should start new round after finished', async () => {
            await tradingFloor.connect(addr1)
                .registration(
                    zero_address,
                    zero_address,
                    {
                         value: ethers.utils.parseEther("20")
                    }
                );
            await tradingFloor.connect(addr1).buyACDMInSale(100000);
            await tradingFloor.connect(addr1).finishRound();

            roundInfo = await tradingFloor.getRound(1);
            roundInfo1 = await tradingFloor.getRound(0);

            roundTotalSupply = Number(roundInfo.totalSupply);
            roundSaleOrTrade = roundInfo.saleOrTrade;
            roundTradingVolume = Number(roundInfo.tradingVolumeETH);
         
            expect(roundTotalSupply).to.equal(0);
            expect(roundSaleOrTrade).to.equal(true);
            expect(roundTradingVolume).to.equal(0);
        });
          
        it('finishRound: should emit "RoundStarted"', async () => {
            await tradingFloor.connect(addr1)
                .registration(
                    zero_address,
                    zero_address,
                    {
                         value: ethers.utils.parseEther("20")
                    }
                );
      
            await tradingFloor.connect(addr1).buyACDMInSale(100000);
         
            await expect(
                tradingFloor.connect(addr1)
                .finishRound())
            .to.emit(tradingFloor, "RoundStarted");
        });  
        
        //Trade round
    it('addOrder: should add new order', async () => {
        await tradingFloor.connect(addr1)
            .registration(
                zero_address,
                zero_address,
                {
                     value: ethers.utils.parseEther("20")
                }
            );
     
        await tradingFloor.connect(addr1).buyACDMInSale(100000);
        await tradingFloor.connect(addr1).finishRound();
  
        await tradingFloor.connect(addr1).addOrder(1, 3);
  
        orderInfo = await tradingFloor.getOrder(0);
       
        orderowner = orderInfo._owner;
        orderTotalAmountACDM = Number(orderInfo._totalAmountACDM);
        ordertotalPriceForACDM = Number(orderInfo._totalPriceForACDM);
         
        expect(orderowner).to.equal(addr1.address);
        expect(orderTotalAmountACDM).to.equal(3);
        expect(ordertotalPriceForACDM ).to.equal(1);
        
    });

    it('addOrder: should be reverted with"Insufficent tokens"', async () => {
        await tradingFloor.connect(addr1)
            .registration(
                zero_address,
                zero_address,
                {
                     value: ethers.utils.parseEther("20")
                }
            );
        
            await tradingFloor.connect(addr1).buyACDMInSale(1);
        await tradingFloor.connect(addr1).finishRound();
        await expect(
            tradingFloor.connect(addr1)
            .addOrder(1, ethers.utils.parseEther("20")))
        .to.be.revertedWith("Insufficent tokens")
    });

    it('addOrder: should be reverted with"Not a trade round"', async () => {
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
            .addOrder(1, 3))
        .to.be.revertedWith("Not a trade round")
    });
   
    
    it('buyOrder: should buy order', async () => {
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

        await tradingFloor.connect(addr1).buyACDMInSale(100000);
        await tradingFloor.connect(addr1).finishRound();
        await tradingFloor.connect(addr1).addOrder(1, 30);
  
        orderInfo = await tradingFloor.getOrder(0);
        // console.log("addr1");
        // console.log(Number(await tradingFloor.balanceOfETH(addr1.address)));
        // console.log("___________");
        // console.log(Number(await token.balanceOf(addr1.address)));
        // console.log("___________");
        // console.log(Number(await tradingFloor.balanceOfACDM(addr1.address)));
        // console.log("___________");
        // console.log("баланс на аккаунте",Number(await ethers.provider.getBalance(addr1.address)));
        // console.log("addr2");
        // console.log(Number(await tradingFloor.balanceOfETH(addr2.address)));
        // console.log("___________");
        // console.log(Number(await token.balanceOf(addr2.address)));
        // console.log("___________");
        // console.log(Number(await tradingFloor.balanceOfACDM(addr2.address)));
        // console.log("___________");
        // console.log("баланс на аккаунте",Number(await ethers.provider.getBalance(addr2.address)));
        
        token.connect(addr2).approve(tradingFloor.address, ethers.utils.parseEther("20"));
        token.connect(addr1).approve(tradingFloor.address, ethers.utils.parseEther("20"));
        
        balanceOfAddr1InTradingFloorInETH = Number(await tradingFloor.balanceOfETH(addr1.address));
        balanceOfAddr1InToken = Number(await token.balanceOf(addr1.address));
        balanceOfAddr1InACDM = Number(await tradingFloor.balanceOfACDM(addr1.address));
        
        await tradingFloor.connect(addr2).buyOrder(0, 20,{
            value: ethers.utils.parseEther("0.5")
       });

        orderInfo = await tradingFloor.getOrder(0);
        expect(Number(await tradingFloor.balanceOfACDM(addr1.address)) ).to.equal(Number(await token.balanceOf(addr1.address)));
        expect(Number(await tradingFloor.balanceOfACDM(addr1.address)) ).to.equal(Number(9.998e+22));
        expect(Number(await tradingFloor.balanceOfACDM(addr2.address)) ).to.equal(Number(await token.balanceOf(addr2.address)));
        expect(Number(await tradingFloor.balanceOfACDM(addr2.address)) ).to.equal(20000000000000000000);
    });

    it('buyOrder: should revert with "Insufficens tokens"', async () => {
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

        await tradingFloor.connect(addr1).buyACDMInSale(100000);
        await tradingFloor.connect(addr1).finishRound();  
        await tradingFloor.connect(addr1).addOrder(1, 30);

        token.connect(addr2).approve(tradingFloor.address, ethers.utils.parseEther("20"));
        token.connect(addr1).approve(tradingFloor.address, ethers.utils.parseEther("20"));    
            
        await expect(
            tradingFloor.connect(addr1)
            .buyOrder(0, 40,{
                value: ethers.utils.parseEther("0.5")
           }))
        .to.be.revertedWith('Insufficent tokens')
    });
    it('buyOrder: should revert with "Insufficens tokens"', async () => {
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
                
            await tradingFloor.connect(addr1).buyACDMInSale(100000);
            await tradingFloor.connect(addr1).finishRound();  
            await tradingFloor.connect(addr1).addOrder(1, 30);

            token.connect(addr2).approve(tradingFloor.address, ethers.utils.parseEther("20"));
            token.connect(addr1).approve(tradingFloor.address, ethers.utils.parseEther("20"));    
                
            await expect(
                tradingFloor.connect(addr1)
                .buyOrder(0, 20,{
                    value: ethers.utils.parseEther("0.5")
            }))
            .to.emit(tradingFloor, "OrderBought")
        });
    });
});


