const Web3 = require('web3');
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('Token contract', () => {
    let Token, token, Dao, dao, chairPerson, owner, addr1, addr2;
    // const metadata = JSON.parse(fs.readFileSync('artifacts/contracts/Token.sol/Token.json'));
    // metadata.abi 

    const setCommisionAbi = ["function setCommission(uint256 newCommission)"];
    const setCommissionInt = new ethers.utils.Interface(setCommisionAbi);

    TransactonByteCode = setCommissionInt.encodeFunctionData(
        'setCommission', [10]
    );

    beforeEach(async () => {
        Token = await ethers.getContractFactory('Token');
        token = await Token.deploy();
        [owner, chairPerson, addr1, addr2, _] = await ethers.getSigners();
        Dao = await ethers.getContractFactory('DAO');
        dao = await Dao.deploy(
            chairPerson.address, 
            token.address, 
            500, 
            (3600 * 24 * 3)
        );
        token.connect(owner).setDaoAddress(dao.address);
    });

    describe('Deployment', () => {
        it('Should set right owner for token', async () => {
            await token.deployed();
            expect(await token.owner()).to.equal(owner.address);
        });

        it("Deployment should assign the total supply of tokens to the owner", async function () {
            const ownerBalance = await token.balanceOf(owner.address);
            expect(await token.totalSupply()).to.equal(ownerBalance);
        });

        it('Should set right chair person', async () => {
            expect(await dao.chairPerson()).to.equal(chairPerson.address);
        });

        it('Should set right chair token', async () => {
            expect(await dao.voteToken()).to.equal(token.address);
        });

        it('Should set right chair minimum Quorum', async () => {
            expect(await dao.minimumQuorum()).to.equal(500);
        });

        it('Should set right chair voting period', async () => {
            expect(await dao.debatingPeriod()).to.equal(3600 * 24 * 3);
        });

        it('Should set right dao address', async () => {
            expect(dao.address).to.equal(await token.getDaoAddress());
        });
    });

    describe('Transactions', () => {
        it('Should deposit 500 tokens on dao', async () => {
            await dao.connect(owner).deposit(500);
            const ownerBalanceDao = await dao.balanceOf(owner.address);
            const ownerBalanceToken = await token.balanceOf(owner.address);
            expect(ownerBalanceDao).to.equal("500");
            expect(ownerBalanceToken).to.equal("500");
        });
        
        it('Should deposit 500 tokens on owner address and 300 on addr1', async () => {
            await token.connect(owner).transfer(addr1.address, 305);

            await dao.connect(owner).deposit(500);
            await dao.connect(addr1).deposit(300);
            
            const ownerBalance = await dao.balanceOf(owner.address);
            const addr1Balance = await dao.balanceOf(addr1.address);
            
            expect(ownerBalance).to.equal("500");
            expect(addr1Balance).to.equal("300");
        });

        it("Add proposal: should add proposal", async () => {
            await dao.connect(owner).deposit(500);
            await dao.connect(owner).
                addProposal(
                    token.address,
                    "test proposal",
                    TransactonByteCode);
            
            var result = await dao.getProposal(0);

            expect(result.recipient).to.equal(token.address);
            expect(result.transactionByteCode).to.equal(TransactonByteCode);
            expect(result.description).to.equal("test proposal");
            expect(result.open).to.equal(true);
        });

        it("Add proposal: should reverted if not token holder", async () => {
         await expect(
            dao.connect(owner).
                addProposal(
                    token.address,
                    "test proposal",
                    TransactonByteCode))
            .to.be.revertedWith("Insufficens funds")
        });

        it("Add proposal: should emit 'ProposalCreated'", async () => {
            await dao.connect(owner).deposit(500);
            await expect(
               dao.connect(owner).
                   addProposal(
                       token.address,
                       "test proposal",
                       TransactonByteCode))
            .to.emit(dao, "ProposalCreated")
               .withArgs(
                    token.address,
                    TransactonByteCode,
                    "test proposal",
                    (Number(await dao.getBlockTimeStamp())) + Number(await dao.debatingPeriod())
               )
           });

        it('Delegate: should delegate votes', async () => {
            await token.connect(owner).transfer(addr1.address, 205);
            await token.connect(owner).transfer(addr2.address, 105);
            
            await dao.connect(owner).deposit(300);
            await dao.connect(addr1).deposit(200);
            await dao.connect(addr2).deposit(100);
            await dao.connect(owner).
                addProposal(
                    token.address,
                    "test proposal",
                    TransactonByteCode);

            await dao.connect(addr1).delegate(0, owner.address);
            await dao.connect(addr2).delegate(0, owner.address);

            var delegat1 = await dao.getDelegate(owner.address, 0);

            expect(delegat1[0]).to.equal(addr1.address);
            expect(delegat1[1]).to.equal(addr2.address);
        });

        it("Delegate: should emit 'Delegate'", async () => {
            await token.connect(owner).transfer(addr1.address, 205);
            await dao.connect(addr1).deposit(200);
            await dao.connect(addr1).
                addProposal(
                    token.address,
                    "test proposal",
                    TransactonByteCode);
            await expect(
               dao.connect(addr1)
                    .delegate(0, owner.address)
               )
            .to.emit(dao, "Delegate")
               .withArgs(
                    addr1.address,
                    owner.address,
                    0
               )
        });

        it('Delegate: should delegate votes', async () => {
            await dao.connect(owner).deposit(200);
            await dao.connect(owner).
                addProposal(
                    token.address,
                    "test proposal",
                    TransactonByteCode);
            await expect(
                dao.connect(addr1)
                    .delegate(0, owner.address)
             )
             .to.be.revertedWith("Insufficens funds")
        });

        it("Delegate: should reverted with 'Proposal does not exist'", async () => {
            await token.connect(owner).transfer(addr1.address, 205);
            await dao.connect(addr1).deposit(200);
            
            await expect(
                dao.connect(addr1)
                    .delegate(0, owner.address)
             )
             .to.be.revertedWith("Proposal does not exist")
        });

        it("Delegate: should reverted with 'Proposal already closed'", async () => {
            await token.connect(owner).transfer(addr1.address, 205);
            await dao.connect(addr1).deposit(200);
            await dao.connect(owner).deposit(500);
            await dao.connect(owner).
                addProposal(
                    token.address,
                    "test proposal",
                    TransactonByteCode);
            
            await dao.connect(owner).vote(0, true);
    
            await network.provider.send("evm_increaseTime", [259205])
            await network.provider.send("evm_mine");
    
            await dao.connect(owner).finishVote(0);
            await expect(
                dao.connect(addr1)
                    .delegate(0, owner.address)
             )
             .to.be.revertedWith("Proposal already closed")
        });

      
        it('Vote: should vote for', async () => {
            await dao.connect(owner).deposit(500);
            await dao.connect(owner).
                addProposal(
                    token.address,
                    "test proposal",
                    TransactonByteCode);
            await dao.connect(owner).vote(0, true);
            var vote = await dao.getVote(owner.address, 0);
            var result = await dao.getProposal(0);
            
            expect(vote).to.equal(1);
            expect(result.totalVotes).to.equal(500);
        });

        it("Vote: should emit 'VoteCreated'", async () => {
            await dao.connect(owner).deposit(500);
            await dao.connect(owner).
                addProposal(
                    token.address,
                    "test proposal",
                    TransactonByteCode);
            await expect(
               dao.connect(owner).
                    vote(0, true)
               )
            .to.emit(dao, "VoteCreated")
               .withArgs(
                    owner.address,
                    0,
                    await dao.balanceOf(owner.address),
                    true
               )
        });

        it("Vote: should reverted if not token holder", async () => {
            await dao.connect(owner).deposit(500);
            await dao.connect(owner).
                addProposal(
                    token.address,
                    "test proposal",
                    TransactonByteCode
                );

            await expect(
               dao.connect(addr1).
                   vote(
                       0,
                       true
                    )
            )
            .to.be.revertedWith("Insufficens funds")
        });

        it("Vote: should reverted if proposal already closed", async () => {
            await dao.connect(owner).deposit(500);
            await dao.connect(owner).
                addProposal(
                    token.address,
                    "test proposal",
                    TransactonByteCode
                );
            await network.provider.send("evm_increaseTime", [259200])
            await network.provider.send("evm_mine");
            await dao.connect(owner).finishVote(0);
            await expect(
               dao.connect(addr1).
                   vote(
                       0,
                       true
                    )
            )
            .to.be.revertedWith("Proposal already closed")
        });

        it("Vote: should reverted if proposal doesn't exist", async () => {
            await dao.connect(owner).deposit(500);
            await expect(
               dao.connect(owner).
                   vote(
                       0,
                       true
                    )
            )
            .to.be.revertedWith("Proposal does not exist")
        });

        it("Vote: should reverted if voter already vote", async () => {
            await dao.connect(owner).deposit(500);
            await dao.connect(owner).
                addProposal(
                    token.address,
                    "test proposal",
                    TransactonByteCode
                );
            await dao.connect(owner).
                   vote(
                       0,
                       true
                    )

            await expect(
                dao.connect(owner).
                    vote(
                        0,
                        true
                     )
             )
            .to.be.revertedWith("You are already voted")
        });

        it('FinishVote: should finish vote and change commission from 5 to 10', async () => {
            await dao.connect(owner).deposit(500);
            await dao.connect(owner).
                addProposal(
                    token.address,
                    "test proposal",
                    TransactonByteCode);
            
            await dao.connect(owner).vote(0, true);

            await network.provider.send("evm_increaseTime", [259205])
            await network.provider.send("evm_mine");

            await dao.connect(owner).finishVote(0);

            var tokenCommission = await token.getCommission();
            var result = await dao.getProposal(0);
            
            expect(result.open).to.equal(false);
            expect(result.totalVotes).to.equal(500);
            expect(tokenCommission).to.equal(10);
        });
        
        it("FinishVote: should emit 'ProposalFinished'", async () => {
           
            await dao.connect(owner).deposit(500);
            await dao.connect(owner).
                addProposal(
                    token.address,
                    "test proposal",
                    TransactonByteCode);
            
            await dao.connect(owner).vote(0, true);

            await ethers.provider.send("evm_setNextBlockTimestamp", [ 1741377391]);
    
            await expect(
                dao.connect(owner).
                    finishVote(0)
                )
            .to.emit(dao, "ProposalFinished")
                .withArgs(
                    0,
                    TransactonByteCode,
                    "test proposal",
                    true
                )
        });

        it("FinishVote: should revert with 'Proposal already closed'", async () => {
            await dao.connect(owner).deposit(500);
            await dao.connect(owner).
                addProposal(
                    token.address,
                    "test proposal",
                    TransactonByteCode);
            
            await dao.connect(owner).vote(0, true);
            await dao.connect(owner).finishVote(0);
            await expect(
                dao.connect(owner).
                    finishVote(0)
             )
            .to.be.revertedWith("Proposal already closed")
        });

        it("FinishVote: should revert with 'Proposal does not exist'", async () => {
            await expect(
                dao.connect(owner).
                    finishVote(5)
            )
            .to.be.revertedWith("Proposal does not exist")
        });

        it('ChangeVotingRules: should change voting rules', async () => {        
            await dao
                .connect(chairPerson)
                .changeVotingRules(
                        600,
                        2 * 24 * 3600
                )
            var finalMinQuorum = await dao.minimumQuorum();
            var finalDebatingPeriod = await dao.debatingPeriod();               

            expect(finalDebatingPeriod).to.equal(2 * 24 * 3600);
            expect(finalMinQuorum).to.equal(600); 
        });

        it("ChangeVotingRules: should emit 'VotingRulesChanged'", async () => {
            await expect(
                dao.connect(chairPerson)
                    .changeVotingRules(
                        600,
                        2 * 24 * 3600
                    )
                )
            .to.emit(dao, "VotingRulesChanged")
                .withArgs(
                    600,
                    2 * 24 * 3600
                )
        });

        it("ChangeVotingRules: should revert with 'You are not chair person'", async () => {
            await expect(
                dao.connect(owner)
                    .changeVotingRules(
                        600,
                        2 * 24 * 3600
                )
            )
            .to.be.revertedWith("You are not chair person")
        });

        it('Withdraw: should withdraw tokens', async () => {     
            await dao.connect(owner).deposit(501);
            await dao
                .connect(owner)
                .withdraw(300);

            var finalbalanceDao = await dao.balanceOf(owner.address);
            var finalbalanceToken = await token.balanceOf(owner.address);            

            expect(finalbalanceDao).to.equal(201);
            expect(finalbalanceToken).to.equal(804); 
        });

        it("Withdraw: should revert with 'Balance still lock'", async () => {     
            await dao.connect(owner).deposit(501);
            await dao.connect(owner).
                addProposal(
                    token.address,
                    "test proposal",
                    TransactonByteCode);

            await dao.connect(owner).vote(0, true);

                await expect(
                    dao.connect(owner)
                    .withdraw(300)
                )
                .to.be.revertedWith("Balance still lock")
        });
        describe('View functions', () => {
            it('getVote: should get vote', async () => {
                await dao.connect(owner).deposit(500);
                await dao.connect(owner).
                    addProposal(
                        token.address,
                        "test proposal",
                        TransactonByteCode);
                await dao.connect(owner).vote(0, true);

                var vote = await dao.getVote(owner.address, 0);
        
                expect(vote).to.equal(1);
            });

            it('balanceOf: should get balance of address', async () => {
                await dao.connect(owner).deposit(500);
                
                var balance = await dao.balanceOf(owner.address);
        
                expect(balance).to.equal(500);
            });

            it('getProposal: should get proposal', async () => {
                await dao.connect(owner).deposit(500);
                await dao.connect(owner).
                    addProposal(
                        token.address,
                        "test proposal",
                        TransactonByteCode);

                var result = await dao.getProposal(0);

                expect(result.recipient).to.equal(token.address);
                expect(result.transactionByteCode).to.equal(TransactonByteCode);
                expect(result.description).to.equal("test proposal");
                expect(result.open).to.equal(true);
            });

            it('getUnlockBalance: should get block.timestamp then balance will be unlocked', async () => {
                await dao.connect(owner).deposit(500);
                await dao.connect(owner).
                addProposal(
                    token.address,
                    "test proposal",
                    TransactonByteCode);
                
                await dao.connect(owner).vote(0, true);

                var result = await dao.getUnlockBalance(owner.address);
                expect(result).to.equal((Number(await dao.getBlockTimeStamp())) + Number(await dao.debatingPeriod()));
            });
        });
    });
});


