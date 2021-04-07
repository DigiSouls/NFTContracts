const { expect, assert } = require("chai")
const { web3, ethers } = require("hardhat")
const { BN, time, balance, expectEvent, expectRevert } = require("@openzeppelin/test-helpers")
const ether = require("@openzeppelin/test-helpers/src/ether")

let nft
let owner, acc1, acc2

describe("NFT", function () {
	beforeEach(async function () {
		const rinkebyOpenSeaProxy = "0x7dca125b1e805dc88814aed7ccc810f677d3e1db"
		let NFTContract = await ethers.getContractFactory("DigiSouls")
		nft = await NFTContract.deploy(rinkebyOpenSeaProxy)
		await nft.deployed()

		signers = await ethers.getSigners()
		owner = signers[0]
		acc1 = signers[1]
		acc2 = signers[2]
	})

	it("simple test...", async function () {
		expect(await nft.name()).to.equal("NFTToken Cards")
	})

	it("simple minting test", async function () {
		//owner doesn't have any balance
		expect(await nft.balanceOf(acc1.address, 1)).to.equal(0)

		//mint
		await nft.create(1, 0, "", 0x00)
		await nft.mint(acc1.address, 1, 1, 0x00)

		//acc1 should have a token
		expect(await nft.balanceOf(acc1.address, 1)).to.equal(1)
	})

	it("creating a collection of 1000 items works", async function () {
		//mint
		await nft.create(50000, 0, "", 0x00)
		await nft.mint(owner.address, 1, 50000, 0x00)

		50 - 3202018
		100 - 6441518

		//addr1 should have a token
		expect(await nft.balanceOf(owner.address, 1)).to.equal(50000)
	})

	it("setting a price per collection works", async function () {
		//mint
		await nft.create(50000, 0, "", 0x00)
		await nft.mint(owner.address, 1, 50000, 0x00)
		expect(await nft.balanceOf(owner.address, 1)).to.equal(50000)
		await nft.setPricePerCollection(1, web3.utils.toWei("0.1", "ether")) // 0.1 eth

		expect(await nft.getPricePerCollection(1)).to.equal(web3.utils.toWei("0.1", "ether"))
	})

	it("buying an NFT with money works", async function () {
		//mint
		await nft.create(50000, 0, "", 0x00)
		await nft.mint(owner.address, 1, 50000, 0x00)

		//sets the collection price
		await nft.setCollectionPrice(1, web3.utils.toWei("0.1", "ether"))

		await expect(
			auction.connect(acc1).buyOneNFT({ value: web3.utils.toWei("0.1", "ether") })
		).to.emit(aFactory, "TransferSingle")

		//acc1 should have a token
		expect(await nft.balanceOf(acc1.address, 1)).to.equal(1)
	})
})
