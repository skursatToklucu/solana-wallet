import * as solanaWeb3 from '@solana/web3.js';
import fs from 'fs';

const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');

async function createWallet() {
    const newKeypair = solanaWeb3.Keypair.generate();

    const walletData = {
        publicKey: newKeypair.publicKey.toString(),
        secretKey: Array.from(newKeypair.secretKey),
        balance: 0 
    };
    fs.writeFileSync('wallet.json', JSON.stringify(walletData, null, 2));
    console.log('Cüzdan oluşturuldu:', walletData);
}


async function airdropSol(publicKey: string, amount: number = 1) {
    const publicKeyObj = new solanaWeb3.PublicKey(publicKey);
    const airdropSignature = await connection.requestAirdrop(publicKeyObj, amount * solanaWeb3.LAMPORTS_PER_SOL);
    await connection.confirmTransaction(airdropSignature);
    console.log(`${amount} SOL airdropped to ${publicKey}`);
}

async function checkBalance(publicKey: string) {
    const publicKeyObj = new solanaWeb3.PublicKey(publicKey);
    const balance = await connection.getBalance(publicKeyObj);
    console.log(`Cüzdan bakiyesi: ${balance / solanaWeb3.LAMPORTS_PER_SOL} SOL`);
    return balance / solanaWeb3.LAMPORTS_PER_SOL;
}

async function transferSol(fromSecretKey: number[], toPublicKey: string, amount: number) {
    const fromKeypair = solanaWeb3.Keypair.fromSecretKey(new Uint8Array(fromSecretKey));
    const toPublicKeyObj = new solanaWeb3.PublicKey(toPublicKey);
    const transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
            fromPubkey: fromKeypair.publicKey,
            toPubkey: toPublicKeyObj,
            lamports: amount * solanaWeb3.LAMPORTS_PER_SOL
        })
    );
    const signature = await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [fromKeypair]);
    console.log(`Transfer başarılı: ${signature}`);
}

async function main() {
    const args = process.argv.slice(2);
    switch (args[0]) {
        case 'new':
            await createWallet();
            break;
        case 'airdrop':
            const amount = args[2] ? parseInt(args[2], 10) : 1;
            await airdropSol(args[1], amount);
            break;
        case 'balance':
            await checkBalance(args[1]);
            break;
        case 'transfer':
            const wallet = JSON.parse(fs.readFileSync('wallet.json', 'utf-8'));
            await transferSol(wallet.secretKey, args[1], parseFloat(args[2]));
            break;
        default:
            console.log('Komut tanınmadı.');
    }
}

main().catch(console.error);
