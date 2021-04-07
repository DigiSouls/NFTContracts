// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat")
require("@nomiclabs/hardhat-web3")

async function main() {
	// Hardhat always runs the compile task when running scripts with its command
	// line interface.
	//
	// If this script is run directly using `node` you may want to call compile
	// manually to make sure everything is compiled
	await hre.run("compile")

	// We get the contract to deploy
	const NFTToken = await hre.ethers.getContractFactory("DigiSouls")
	console.log("Deploying DigiSouls...")

	let network = process.env.NETWORK ? process.env.NETWORK : "rinkeby"

	console.log(">-> Network is set to " + network)

	// ethers is avaialble in the global scope
	const [deployer] = await ethers.getSigners()
	const deployerAddress = await deployer.getAddress()
	const account = await web3.utils.toChecksumAddress(deployerAddress)
	const balance = await web3.eth.getBalance(account)

	console.log(
		"Deployer Account " + deployerAddress + " has balance: " + web3.utils.fromWei(balance, "ether"),
		"ETH"
	)

	let openSeaProxy = "0x7dca125b1e805dc88814aed7ccc810f677d3e1db" //rinkeby
	if (network === "mainnet") {
		openSeaProxy = "0xa5409ec958c83c3f309868babaca7c86dcb077c1"
	}

	const deployed = await NFTToken.deploy(openSeaProxy)

	let dep = await deployed.deployed()

	console.log("Contract deployed to:", dep.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
