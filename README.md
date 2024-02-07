# Solana Wallet 

HW0

## Features

- Creating a new wallet
- Airdropping a specific amount of SOL to a specific wallet.
- Checking the balance of a specific wallet.
- Transferring SOL from one wallet to another.

## Installation

After cloning the project to your local computer, use the following command to install dependencies:

```bash
npm install
```

```bash
npm install -g ts-node
```

## Usage

This tool provides a command-line interface for performing Solana wallet functions. You can perform various operations with the following commands:

### Creating a New Wallet

```bash
npx ts-node wallet.ts new
```
### Receiving SOL Airdrop

```bash
npx ts-node wallet.ts airdrop <publicKey> [X]
```

### Checking Wallet Balance

```bash
npx ts-node wallet.ts balance <publicKey>
```

### Transferring SOL

```bash
npx ts-node wallet.ts transfer <walletIndex> <toPublicKey> <Amount>
```

### Solana Network General Statistics

```bash
npx ts-node getNetworkStats.ts
```



