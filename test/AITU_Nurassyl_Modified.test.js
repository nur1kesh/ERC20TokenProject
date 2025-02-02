const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AITU_Nurassyl_Modified ERC20 Token", function () {
  let Token, token, owner, addr1, addr2;
  const initialSupply = 5000; // Custom initial supply for testing

  beforeEach(async function () {
    Token = await ethers.getContractFactory("AITU_Nurassyl_Modified");
    [owner, addr1, addr2, _] = await ethers.getSigners();

    token = await Token.deploy(initialSupply);
    await token.deployed();
  });

  it("Should deploy with correct name and symbol", async function () {
    expect(await token.name()).to.equal("AITU_Nurassyl_SE-2327_Token");
    expect(await token.symbol()).to.equal("UTK");
  });

  it("Should set the correct initial supply", async function () {
    expect(await token.totalSupply()).to.equal(initialSupply * 10 ** 18);
  });

  it("Should assign the total supply to the deployer", async function () {
    expect(await token.balanceOf(owner.address)).to.equal(initialSupply * 10 ** 18);
  });

  it("Should allow transfers and update balances", async function () {
    await token.transfer(addr1.address, 100);
    expect(await token.balanceOf(addr1.address)).to.equal(100);
  });

  it("Should emit TransactionInfo event on transfer", async function () {
    await expect(token.transfer(addr1.address, 100))
      .to.emit(token, "TransactionInfo")
      .withArgs(owner.address, addr1.address, 100, await token.getLastTransactionTimestamp());
  });

  it("Should update last transaction details", async function () {
    await token.transfer(addr1.address, 100);

    expect(await token.getLastTransactionSender()).to.equal(owner.address);
    expect(await token.getLastTransactionReceiver()).to.equal(addr1.address);
    expect(await token.getLastTransactionTimestamp()).to.not.equal("0");
  });

  it("Should fail transfer if sender has insufficient balance", async function () {
    await expect(token.connect(addr1).transfer(owner.address, 1)).to.be.revertedWith(
      "ERC20: transfer amount exceeds balance"
    );
  });

  it("Should allow multiple transfers", async function () {
    await token.transfer(addr1.address, 100);
    await token.transfer(addr2.address, 200);

    expect(await token.balanceOf(addr1.address)).to.equal(100);
    expect(await token.balanceOf(addr2.address)).to.equal(200);
  });

  it("Should update last transaction details after multiple transfers", async function () {
    await token.transfer(addr1.address, 100);
    await token.transfer(addr2.address, 200);

    expect(await token.getLastTransactionSender()).to.equal(owner.address);
    expect(await token.getLastTransactionReceiver()).to.equal(addr2.address);
  });

  it("Should allow approvals and delegated transfers", async function () {
    await token.approve(addr1.address, 200);
    expect(await token.allowance(owner.address, addr1.address)).to.equal(200);

    await token.connect(addr1).transferFrom(owner.address, addr2.address, 150);
    expect(await token.balanceOf(addr2.address)).to.equal(150);
  });

  it("Should revert delegated transfer if allowance is insufficient", async function () {
    await expect(token.connect(addr1).transferFrom(owner.address, addr2.address, 300)).to.be.revertedWith(
      "ERC20: insufficient allowance"
    );
  });

  it("Should decrease allowance after delegated transfer", async function () {
    await token.approve(addr1.address, 200);
    await token.connect(addr1).transferFrom(owner.address, addr2.address, 150);

    expect(await token.allowance(owner.address, addr1.address)).to.equal(50);
  });

  it("Should return a human-readable timestamp for last transaction", async function () {
    await token.transfer(addr1.address, 100);
    const timestamp = await token.getLastTransactionTimestamp();

    expect(timestamp).to.include("Timestamp:");
  });

  it("Should fail if initial supply is not correctly assigned", async function () {
    const newToken = await Token.deploy(0); // Deploy with 0 initial supply
    await newToken.deployed();
    expect(await newToken.totalSupply()).to.equal(0);
  });
});
