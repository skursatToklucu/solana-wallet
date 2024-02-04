# Solana Wallet 

HW0

## Özellikler

- Yeni cüzdan oluşturma ve 1 SOL airdrop alma.
- Belirli bir cüzdana belirli miktar SOL airdrop yapma.
- Belirli bir cüzdanın bakiyesini kontrol etme.
- Bir cüzdandan diğerine SOL transferi yapma.

## Kurulum

Projeyi lokal bilgisayarınıza klonladıktan sonra, bağımlılıkları yüklemek için aşağıdaki komutu kullanın:

```bash
npm install
```

```bash
npm install -g ts-node
```

## Kullanım

Bu araç, Solana cüzdanı işlevlerini gerçekleştirmek için komut satırı arayüzü sağlar. Aşağıdaki komutlarla çeşitli işlemleri yapabilirsiniz:

### Yeni Cüzdan Oluşturma 

```bash
npx ts-node wallet.ts new
```
### SOL Airdrop Alma

```bash
npx ts-node wallet.ts airdrop <publicKey> [X]
```

### Cüzdan Bakiyesini Kontrol Etme

```bash
npx ts-node wallet.ts balance <publicKey>
```

### SOL Transfer Etme

```bash
npx ts-node wallet.ts transfer <toPublicKey> <Amount>
```

### Solana Ağının Genel Istatistikleri

```bash
npx ts-node getNetworkStats.ts
```



