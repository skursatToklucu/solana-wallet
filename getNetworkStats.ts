import * as solanaWeb3 from '@solana/web3.js';

const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');

async function getNetworkStats() {
    try {
        const blockHeight = await connection.getBlockHeight();
        console.log(`Anlık Blok Yüksekliği: ${blockHeight}`);

        const lastBlock = await connection.getBlock(blockHeight);
        if (lastBlock) {
            const transactionCount = lastBlock.transactions.length;
            console.log(`Son Bloktaki İşlem Sayısı: ${transactionCount}`);
        } else {
            console.log('Son blok bilgileri alınamadı.');
        }
    } catch (error) {
        console.error('Ağ istatistikleri alınırken bir hata oluştu:', error);
    }
}

getNetworkStats();
