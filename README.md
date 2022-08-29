# Contracts

## Chainlink LINK ERC-677 token

Lukso LINK: https://explorer.execution.l16.lukso.network/address/0xbFB26279a9D28CeC1F781808Da89eFbBfE2c4268/transactions

(From Ethereum Mainnet LINK contract: https://etherscan.io/token/0x514910771af9ca656af840dff83e8264ecf986ca#code)

## Chainlink Oracle Contract and Job ID:

Oracle.sol: https://explorer.execution.l16.lukso.network/address/0x401ae6Bfb89448fB6e06CE7C9171a8A0366d02d0/transactions

Chainlink Job ID: 13a2fe212bcf40978d8c0d52b8d96e4d

## :fountain: LINK Faucet

Lukso LINK Faucet (20 LINK every 12 hours direct and with Lukso Universal Profile Key Manager transaction relay option):
https://explorer.execution.l16.lukso.network/address/0xe33EE68Fc5477Ea95F4897b67d3E763b7F74FC52/transactions

Relay transaction worked with Lukso LINK Faucet: https://explorer.execution.l16.lukso.network/tx/0xef69c15beadb3368634b9cd22e73daf38ab67381353b5f3e721ae72e84632ede

## :bird: Twitter Name Space

Twitter Name Space contract: https://explorer.execution.l16.lukso.network/address/0x5b1a5a842eB0ac44C0bC831a1233d0ac3b321eA3/transactions

UP mock request: https://explorer.execution.l16.lukso.network/tx/0x82ec4525acc02d2f111b474615908fc06a241663fada04207d3fd647708a8dc5

UP mock fulfill: https://explorer.execution.l16.lukso.network/tx/0xd3c4355ba7e7721523dd5f52bfff5a82734233fa4bcfa5d1f5abcdc37dd5fd64

## Hardhat Testing

### Unit Testing

100% Solidity Coverage for both contracts:

<img src="https://github.com/LuksOracle/contracts/blob/main/test/unit/unitTestCoverage.png" alt="Testing"/>

### Integration Testing

Hardhat would not send Lukso transactions even though they had the right chain ID.

Here are some Twitter IDs we verified outside of Hardhat:

EOA Wallets:

1438606749389541377
(https://twitter.com/i/user/1438606749389541377)
(https://github.com/MarcusWentz)

1018093644
(https://twitter.com/i/user/1018093644)
(https://github.com/m-r-g-t)

903308459147448324
(https://twitter.com/0xfinesto)
(https://github.com/thomas779)

53525037
(https://twitter.com/gabibibah)
(https://github.com/gabiburkoth)

Universal Profile:

1563659416347430912
(https://twitter.com/luksOracle)
(https://github.com/LuksOracle)
