import * as solanaWeb3 from '@solana/web3.js';
import fs from 'fs';

const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('testnet'), 'confirmed');

async function createWallet() {
    const newKeypair = solanaWeb3.Keypair.generate();

    const walletData = {
        publicKey: newKeypair.publicKey.toString(),
        secretKey: Array.from(newKeypair.secretKey),
        balance: 0
    };
    let walletsArray = [];

    // Dosyanın var olup olmadığını kontrol et
    if (fs.existsSync('wallet.json')) {
        // Dosyayı oku ve mevcut cüzdan listesini al
        const data = fs.readFileSync('wallet.json', 'utf-8');
        walletsArray = JSON.parse(data);
    }

    // Yeni cüzdanı listeye ekle
    walletsArray.push(walletData);

    // Dosyayı yeni liste ile güncelle
    fs.writeFileSync('wallet.json', JSON.stringify(walletsArray, null, 2));
    console.log('New wallet added:', walletData);
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
    console.log(`Balance: ${balance / solanaWeb3.LAMPORTS_PER_SOL} SOL`);
    return balance / solanaWeb3.LAMPORTS_PER_SOL;
}

async function transferSol(fromSecretKey: number[], toPublicKey: string, amount: number) {
    const fromKeypair = solanaWeb3.Keypair.fromSecretKey(new Uint8Array(fromSecretKey));
    const toPublicKeyObj = new solanaWeb3.PublicKey(toPublicKey);
    
    // İşlem ücretini hesapla
    const { feeCalculator } = await connection.getRecentBlockhash();
    const transactionFee = feeCalculator.lamportsPerSignature * 100; 
    const totalAmount = amount * solanaWeb3.LAMPORTS_PER_SOL + transactionFee; 

    // Gönderici cüzdanın bakiyesini kontrol et
    const fromBalance = await connection.getBalance(fromKeypair.publicKey);
    if (fromBalance < totalAmount) {
        console.log(`Yetersiz bakiye: Gerekli bakiye ${totalAmount / solanaWeb3.LAMPORTS_PER_SOL} SOL, mevcut bakiye ${fromBalance / solanaWeb3.LAMPORTS_PER_SOL} SOL`);
        return; // Yetersiz bakiye varsa işlemi durdur
    }

    // Transfer işlemi
    const transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
            fromPubkey: fromKeypair.publicKey,
            toPubkey: toPublicKeyObj,
            lamports: amount * solanaWeb3.LAMPORTS_PER_SOL 
        })
    );
    const signature = await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [fromKeypair]);
    console.log(`Transfer is successful: ${signature}`);
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
                // cüzdanların saklandığı dosyayı oku
                const wallets = JSON.parse(fs.readFileSync('wallet.json', 'utf-8'));
                // args[1] yerine cüzdan indexini almalıyız, args[2] alıcının publicKey'i, args[3] miktar
                const walletIndex = parseInt(args[1], 10); // args[1] artık cüzdanın indexi
                if (walletIndex < 0 || walletIndex >= wallets.length) {
                    console.log("Invalid wallet index.");
                    return;
                }
                const fromWallet = wallets[walletIndex];
                const toPublicKey = args[2]; // Alıcının publicKey'i
                const transferAmount = parseFloat(args[3]); // Transfer miktarı
                await transferSol(fromWallet.secretKey, toPublicKey, transferAmount);
                break;
            default:
                console.log('Command not recognized.');
    }
}

main().catch(console.error);
