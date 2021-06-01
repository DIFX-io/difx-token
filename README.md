# Deployment Instructions

1. Clone the repo
2. Create `.env` file with following variables
    `PRIVATE_KEY`: Deployment Private Key
    `INFURA_KEY`: Infura API Key
    `ETHERSCAN_KEY`: Etherscan API Key
3. Add values to the variables in the `scripts/deploy.js` file
4. To deploy on testnet, run `npx hardhat run --network kovan scripts/deploy.js`
5. Step 4 will log the command to verify the contract on Etherscan, enter that command.
6. To deploy on mainnet run `npx hardhat run --network mainnet scripts/deploy.js`

