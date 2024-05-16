//sendSol.js
const web3 = require("@solana/web3.js");
const connection = new web3.Connection(
    "https://necessary-spring-shard.solana-devnet.quiknode.pro/0417dc7b4af48216baf61e31edbabb9a71579a91/",
    'confirmed',
  );

const secret=[0..0]; // Replace with your secret key
const from = web3.Keypair.fromSecretKey(new Uint8Array(secret));

// Generate a random address to send to
const to = web3.Keypair.generate();

(async () => {
    const transaction = new web3.Transaction().add(
        web3.SystemProgram.transfer({
          fromPubkey: from.publicKey,
          toPubkey: to.publicKey,
          lamports: web3.LAMPORTS_PER_SOL * 5,
        }),
      );
    
      // Sign transaction, broadcast, and confirm
      const signature = await web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [from],
      );
      console.log('SIGNATURE', signature);
})()


