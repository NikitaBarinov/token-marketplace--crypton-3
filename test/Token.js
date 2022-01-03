const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('Token contract', () => {
    let Token, token, chairPerson, owner, addr1, addr2;
    const adminRole = ethers.constants.HashZero;
   
    const minterRole =ethers.utils.solidityKeccak256(["string"],["MINTER_ROLE"]);
    const burnerRole =ethers.utils.solidityKeccak256(["string"],["BURNER_ROLE"]);
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
                    zero_address
                );

            const addr1Refers = await tradingFloor.getRefer(addr1.address);
        
            expect(addr1Refers).to.equal(zero_address);
            });

        it('Registration: should register user with refer', async () => {
            await tradingFloor.connect(addr1)
            .registration(
                owner.address
            );

            const ownerRefers = await tradingFloor.getRefer(addr1.address);
        
            expect(ownerRefers).to.equal(owner.address);
        });

        it("Registration: should reverted with 'Can not be self-referer'", async () => {
            await expect(
                tradingFloor.connect(addr1)
                .registration(
                    addr1.address
                ))
            .to.be.revertedWith("Can not be self-referer")
        });

        it("Registration: should emit 'UserIsRegistrated'", async () => {
        await expect(
            tradingFloor.connect(addr1)
            .registration(
                zero_address
            ))
        .to.emit(tradingFloor, "UserIsRegistrated")
        });

        it('buyACDMInSale: should buy 100 ACDM', async () => {
            await tradingFloor.connect(addr1)
                .registration(
                    owner.address
            );

            await tradingFloor.connect(addr1).buyACDMInSale(100, {
                value: ethers.utils.parseEther("5")
            });
            
            balanceOfTradingFloorInToken = Number(await token.balanceOf(tradingFloor.address));
             
            expect(balanceOfTradingFloorInToken).to.equal(99900);
            expect( Number(await token.balanceOf(addr1.address))).to.equal(100);
        });

        it("buyACDMInSale: should reverted with 'Insufficent funds'", async () => {            
           await expect(
                tradingFloor.connect(addr1)
                .buyACDMInSale(1000))
            .to.be.revertedWith("Insufficent funds")
        });

        it("buyACDMInSale: should reverted with 'Not a sale round'", async () => {
            await tradingFloor.connect(addr1).buyACDMInSale(100,{
                value: ethers.utils.parseEther("25")
           });
            await tradingFloor.connect(addr1).finishRound();
            
            await expect(
                tradingFloor.connect(addr1)
                .buyACDMInSale(100,{
                    value: ethers.utils.parseEther("25")
               }))
            .to.be.revertedWith("Not a sale round")
        });
        
        it("buyACDMInSale: should emit 'ACDMBought'", async () => { 
                await expect(
                    tradingFloor.connect(addr1)
                    .buyACDMInSale(100,{
                        value: ethers.utils.parseEther("25")
                   }))
                .to.emit(tradingFloor, "ACDMBought");      
        });

        it("buyACDMInSale: should emit 'FeeTransfered'", async () => { 
            await tradingFloor.connect(addr1)
                .registration(
                    owner.address
            );
            await expect(
                tradingFloor.connect(addr1)
                .buyACDMInSale(100,{
                    value: ethers.utils.parseEther("25")
               }))
            .to.emit(tradingFloor, "FeeTransfered");      
    });

        it('finishRound: should finish round', async () => {
            await tradingFloor.connect(addr1)
                .registration(
                    owner.address
                );

            await tradingFloor.connect(addr1).buyACDMInSale(100,{
                value: ethers.utils.parseEther("25")
            });

            await network.provider.send("evm_increaseTime", [259200])
            await network.provider.send("evm_mine");

            await tradingFloor.connect(addr1).finishRound();

            roundInfo = await tradingFloor.getRound(0);

            roundTotalSupply = Number(roundInfo.totalSupply);
            roundSaleOrTrade = roundInfo.saleOrTrade;
            roundTradingVolume = Number(roundInfo.tradingVolumeETH);
            
            expect(roundTotalSupply).to.equal(100000);
            expect(roundSaleOrTrade).to.equal(false);
            expect(roundTradingVolume).to.equal(1000000000000000);
        });

        it('finishRound: should start new round after finished', async () => {
            await tradingFloor.connect(addr1).buyACDMInSale(100000,{
                value: ethers.utils.parseEther("25")
            });
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

        it('finishRound: should start new sale round after finished', async () => {
            await tradingFloor.connect(addr1).buyACDMInSale(100000,{
                value: ethers.utils.parseEther("25")
            });
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
            await tradingFloor.connect(addr1).buyACDMInSale(100000,{
                value: ethers.utils.parseEther("25")
            });
         
            await expect(
                tradingFloor.connect(addr1)
                .finishRound())
            .to.emit(tradingFloor, "RoundStarted");
        });  

        it('finishRound: should emit "PriceChanged"', async () => {      
            await tradingFloor.connect(addr1).buyACDMInSale(100000,{
                value: ethers.utils.parseEther("25")
            });
            await tradingFloor.connect(addr1).finishRound();
            await expect(
                tradingFloor.connect(addr1)
                .finishRound())
            .to.emit(tradingFloor, "PriceChanged");
        });  
            
        it('addOrder: should add new order', async () => {
            await tradingFloor.connect(addr1).buyACDMInSale(100000,{
                value: ethers.utils.parseEther("25")
            });
            await tradingFloor.connect(addr1).finishRound();
    
            await tradingFloor.connect(addr1).addOrder(1, 3);
        
            orderInfo = await tradingFloor.getOrder(1, 0);
            
            orderowner = orderInfo.owner;
            orderTotalAmountACDM = Number(orderInfo.totalAmountACDM);
            ordertotalPriceForACDM = Number(orderInfo.totalPriceForACDM);
            
            expect(orderowner).to.equal(addr1.address);
            expect(orderTotalAmountACDM).to.equal(3);
            expect(ordertotalPriceForACDM ).to.equal(1);
        });

        it('addOrder: should be reverted with "Insufficent tokens"', async () => {
            await tradingFloor.connect(addr1).buyACDMInSale(1,{
                value: ethers.utils.parseEther("25")
            });
            
            await tradingFloor.connect(addr1).finishRound();
        
            await expect(
                tradingFloor.connect(addr1)
                .addOrder(1, 100000))
            .to.be.revertedWith("Insufficent tokens")
        });

        it('addOrder: should be reverted with "Not a trade round"', async () => {    
            await tradingFloor.connect(addr1).buyACDMInSale(1,{
                value: ethers.utils.parseEther("25")
            });
            await expect(
                tradingFloor.connect(addr1)
                .addOrder(1, 3))
            .to.be.revertedWith("Not a trade round")
        });
    
        it('buyOrder: should buy order', async () => {
            await tradingFloor.connect(addr1).buyACDMInSale(100,
                {
                        value: ethers.utils.parseEther("20")
            });
            await tradingFloor.connect(addr1).finishRound();
            await tradingFloor.connect(addr1).addOrder(1, 30);
        
        
            token.connect(addr2).approve(tradingFloor.address, ethers.utils.parseEther("20"));
            token.connect(addr1).approve(tradingFloor.address, ethers.utils.parseEther("20"));
            
            balanceOfAddr1InToken = Number(await token.balanceOf(addr1.address));
            balanceOfAddr1InACDM = Number(await tradingFloor.balanceOfACDM(addr1.address));
        
            await tradingFloor.connect(addr2).buyOrder(0, 20,{
                value: ethers.utils.parseEther("5")
            });
        
            orderInfo = await tradingFloor.getOrder(1, 0);
            expect(Number(await tradingFloor.balanceOfACDM(addr1.address)) ).to.equal(Number(await token.balanceOf(addr1.address)));
            expect(Number(await tradingFloor.balanceOfACDM(addr1.address)) ).to.equal(80);
            expect(Number(await tradingFloor.balanceOfACDM(addr2.address)) ).to.equal(Number(await token.balanceOf(addr2.address)));
            expect(Number(await tradingFloor.balanceOfACDM(addr2.address)) ).to.equal(20);
        });

        it('buyOrder: should be revevrted with "Order does not exist"', async () => {
            await tradingFloor.connect(addr1).buyACDMInSale(100,
                {
                        value: ethers.utils.parseEther("20")
            });
            await tradingFloor.connect(addr1).finishRound();
             
            token.connect(addr2).approve(tradingFloor.address, ethers.utils.parseEther("20"));
            token.connect(addr1).approve(tradingFloor.address, ethers.utils.parseEther("20"));

            await expect(
                tradingFloor.connect(addr1)
                .buyOrder(6, 20,{
                    value: ethers.utils.parseEther("5")
                }))
            .to.be.revertedWith("Order does not exist")
        });

        it('buyOrder: should revert with "Insufficens funds"', async () => {
            await tradingFloor.connect(addr1).buyACDMInSale(100000,{
                value: ethers.utils.parseEther("20")
            });
            await tradingFloor.connect(addr1).finishRound();  
            await tradingFloor.connect(addr1).addOrder(1, 30);

            token.connect(addr2).approve(tradingFloor.address, ethers.utils.parseEther("20"));
            token.connect(addr1).approve(tradingFloor.address, ethers.utils.parseEther("20"));    
                
            await expect(
                tradingFloor.connect(addr1)
                .buyOrder(0, 40))
            .to.be.revertedWith('Insufficent tokens')
        });

        it('buyOrder: should revert with "Insufficens tokens"', async () => {
            await tradingFloor.connect(addr1).buyACDMInSale(100000,{
                value: ethers.utils.parseEther("20")
            });
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

        it('buyOrder: should emit "Order bought"', async () => {
                await tradingFloor.connect(addr1).buyACDMInSale(1000,{
                    value: ethers.utils.parseEther("0.5")
                });
                await tradingFloor.connect(addr1).finishRound();  
                await tradingFloor.connect(addr1).addOrder(1, 30);

                token.connect(addr2).approve(tradingFloor.address, ethers.utils.parseEther("20"));
                token.connect(addr1).approve(tradingFloor.address, ethers.utils.parseEther("20"));    
                    
                await expect(
                    tradingFloor.connect(addr1)
                    .buyOrder(0, 20,{
                        value: ethers.utils.parseEther("10")
                }))
                .to.emit(tradingFloor, "OrderBought")
                
        });

        it('buyOrder: should emit "FeeTransfered"', async () => {
            await tradingFloor.connect(addr1)
                .registration(
                    owner.address
            );
            await tradingFloor.connect(addr1).buyACDMInSale(1000,{
                value: ethers.utils.parseEther("0.5")
            });
            await tradingFloor.connect(addr1).finishRound();  
            await tradingFloor.connect(addr1).addOrder(1, 30);

            token.connect(addr2).approve(tradingFloor.address, ethers.utils.parseEther("20"));
            token.connect(addr1).approve(tradingFloor.address, ethers.utils.parseEther("20"));    
                
            expect(await
                tradingFloor.connect(addr1)
                .buyOrder(0, 20,{
                    value: ethers.utils.parseEther("10")
            }))
            .to.emit(tradingFloor, 'FeeTransfered');
        });

        it('closeOrder: should close open order', async () => {
            await tradingFloor.connect(addr1).buyACDMInSale(1000,{
                value: ethers.utils.parseEther("0.5")
            });
            await tradingFloor.connect(addr1).finishRound();  
            await tradingFloor.connect(addr1).addOrder(1, 30);
            
            await tradingFloor.connect(addr1).cancelOrder(0);
            var orderInfo = await tradingFloor.connect(addr1).getOrder(1, 0);

            
            expect(addr1.address).to.equal(orderInfo.owner);
            expect(false).to.equal(orderInfo.open);
            expect(0).to.equal(orderInfo.balance);
        });

        it('closeOrder: should reverted with "Order already closed"', async () => {
            await tradingFloor.connect(addr1).buyACDMInSale(1000,{
                value: ethers.utils.parseEther("0.5")
            });
            await tradingFloor.connect(addr1).finishRound();  
            await tradingFloor.connect(addr1).addOrder(1, 30);
            await tradingFloor.connect(addr1)
            .cancelOrder(0);
            await expect(
                tradingFloor.connect(addr1)
                .cancelOrder(0))
            .to.be.revertedWith('Order already closed')
        });

        it('closeOrder: should reverted with "Not order owner"', async () => {
            await tradingFloor.connect(addr1).buyACDMInSale(1000,{
                value: ethers.utils.parseEther("0.5")
            });
            await tradingFloor.connect(addr1).finishRound();  
            await tradingFloor.connect(addr1).addOrder(1, 30);
           
            await expect(
                tradingFloor.connect(owner)
                .cancelOrder(0))
            .to.be.revertedWith('Not order owner')
        });

        it('closeOrder: should emit "OrderCancelled"', async () => {
            await tradingFloor.connect(addr1).buyACDMInSale(1000,{
                value: ethers.utils.parseEther("0.5")
            });
            await tradingFloor.connect(addr1).finishRound();  
            await tradingFloor.connect(addr1).addOrder(1, 30);
   
            expect(await
                tradingFloor.connect(addr1)
                .cancelOrder(0))
            .to.emit(tradingFloor, 'OrderCancelled');
        });

        it('withdraw: should withdraw ETH', async () => {
           await tradingFloor.connect(addr1).buyACDMInSale(1000,{
                value: ethers.utils.parseEther("0.5")
            });
            
            const initTFBalance = await ethers.provider.getBalance(tradingFloor.address);
    
            await tradingFloor.connect(owner).withdraw(owner.address,1000);  
            
            const finalTFBalance = await ethers.provider.getBalance(tradingFloor.address);
            
            expect(Number(initTFBalance - finalTFBalance)).to.equal(1000);
        });

        it('withdraw: should reverted with "Ownable: caller is not the owner" ', async () => {
            await tradingFloor.connect(addr1).buyACDMInSale(1000,{
                 value: ethers.utils.parseEther("0.5")
             });

            await expect(
                tradingFloor.connect(addr1)
                .withdraw(owner.address, ethers.utils.parseEther("0.001")))
            .to.be.revertedWith('Ownable: caller is not the owner')
         });

        it('withdraw: should emit "Withdraw"', async () => {
            await tradingFloor.connect(addr1).buyACDMInSale(1000,{
                    value: ethers.utils.parseEther("0.5")
                });
            
            await tradingFloor.connect(owner).withdraw(owner.address,1000);  
            
            expect(await
                tradingFloor.connect(owner).
                withdraw(owner.address,1000))
            .to.emit(tradingFloor, 'Withdraw');
        });

        it('Pausable: should pause and unpause contract', async () => {
            await tradingFloor.pause();
            
            await expect(tradingFloor.connect(addr1).buyACDMInSale(1000,{
                value: ethers.utils.parseEther("0.5")
            })).to.be.revertedWith('Pausable: paused');

            await tradingFloor.unpause();

            await tradingFloor.connect(addr1).buyACDMInSale(1000,{
                value: ethers.utils.parseEther("0.5")
            });
    
            expect(await token.connect(owner).balanceOf(addr1.address)).to.equal(1000);
        });

        it('Pausable: should be reverted with "Ownable: caller is not the owner"', async () => {
            await expect(tradingFloor.connect(addr1).pause())
            .to.be.revertedWith('Ownable: caller is not the owner'); 
        });
    });
    
});







