const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account: ' + deployer.address);

  // Deploy BallotBasic
    const Ballot = await ethers.getContractFactory('Ballot');
    const ballot = await Ballot.deploy();

  // Deploy BallotWithModifier
    // const Bidder = await ethers.getContractFactory('Bidder');
    // const bidder = await Bidder.deploy(first.address);

   console.log( "Ballot: " + ballot.address );
  //  console.log( "Bidder: " + bidder.address ); 

}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})