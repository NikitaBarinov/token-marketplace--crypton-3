
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('Token contract', () => {
    let Token, token, owner, addr1, addr2;

    beforeEach(async () => {
        Token = await ethers.getContractFactory('Token');
        token = await Token.deploy();
        [owner, addr1, addr2, _] = await ethers.getSigners();
    });

    describe('Deployment', () => {
        it('Should set right owner', async () => {
            await token.deployed();
            expect(await token.owner()).to.equal(owner.address);
        });

        it("Deployment should assign the total supply of tokens to the owner", async function () {
            const ownerBalance = await token.balanceOf(owner.address);
            expect(await token.totalSupply()).to.equal(ownerBalance);
        });
    });

    describe('Transactions', () => {
        it('Should transfer ownership from owner to addr1', async () => {
            await token.connect(owner).transferOwnership(addr1.address); 
            expect(await token.owner()).to.equal(addr1.address);
        });

        it('Should fail if msg.sender not owner', async () => {
            await 
            expect(token
                .connect(addr2)
                .transferOwnership(addr1.address))
            .to
            .be
            .revertedWith("Ownable: caller is not owner");
        });

        it('Should fail if newOwner have zero address', async () => {
            await 
            expect(token
                .connect(owner)
                .transferOwnership("0x0000000000000000000000000000000000000000")
            )
            .to
            .be
            .revertedWith("Address is zero address");
        });

        it("Should emit OwnershipTransferred event", async () => {
            await expect(token.connect(owner).transferOwnership(addr1.address))
              .to.emit(token, "OwnershipTransferred")
              .withArgs(owner.address, addr1.address);
        });

        it('Should transfer tokens to addr1', async () => {

            await token.connect(owner).transfer(addr1.address, 1);

            const ownerBalance = await token.balanceOf(owner.address);
            const addr1Balance = await token.balanceOf(addr1.address);

            expect(ownerBalance).to.equal("999");
            expect(addr1Balance).to.equal("1");
        });

        it("Should emit Transfer event", async () => {
            await expect(token.connect(owner).transfer(addr1.address, 1))
              .to.emit(token, "Transfer")
              .withArgs(owner.address, addr1.address, 1);
        });

        it('Should fail if senders balance is too low', async () => {
            await expect(token.connect(addr1).transfer(owner.address, 2))
                .to
                .be
                .revertedWith('Insufficient funds');

            const ownerBalance = await token.balanceOf(owner.address);
            const addr1Balance = await token.balanceOf(addr1.address);

            expect(ownerBalance).to.equal("1000");
            expect(addr1Balance).to.equal("0");
        });

        it('Should approve 10 tokens for addr1', async () => {

            await token.connect(owner).approve(addr1.address, 10);

            const addr1Allowance = await token
                .allowance(owner.address, addr1.address);

            expect(addr1Allowance).to.equal("10");
        });

        it("Should emit Approval event", async () => {
            await expect(token.connect(owner).approve(addr1.address, 10))
              .to.emit(token, "Approval")
              .withArgs(owner.address, addr1.address, 10);
        });

        it('Should transfer 5 tokens from addr1 to addr2', async () => {
            await token.connect(owner)
                .approve(
                    addr1.address,
                    10
                );

            await token.connect(addr1)
                .transferFrom(
                    owner.address,
                    addr2.address,
                    5
                );

            const addr1Allowance = await token
                .allowance(
                    owner.address,
                    addr1.address
                );

            const ownerBalance = await token.balanceOf(owner.address);
            const addr2Balance = await token.balanceOf(addr2.address);

            expect(ownerBalance).to.equal("995");
            expect(addr2Balance).to.equal("5");
            expect(addr1Allowance).to.equal("5");

        });

        it('Should fail if sender allowance is too low', async () => {
            await expect(token.connect(addr1).transferFrom(
                owner.address,
                addr2.address,
                5
            ))
                .to
                .be
                .revertedWith('Insufficient Confirmed Funds');

            const addr1Allowance = await token
                .allowance(
                    owner.address,
                    addr1.address
                );

            expect(addr1Allowance).to.equal("0");
        });

        it('Should fail if senders balance is too low', async () => {
            await expect(token.connect(addr1).transferFrom(
                addr1.address,
                addr2.address,
                5
            ))
                .to
                .be
                .revertedWith('Insufficient funds');

            const addr1Balance = await token
                .balanceOf(
                    addr1.address
                );

            expect(addr1Balance).to.equal("0");
        });
    });
});


