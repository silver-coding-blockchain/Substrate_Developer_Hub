const solanaWeb3=require('@solana/web3.js');
const generateKey=async()=>{
    const keypair=solanaWeb3.Keypair.generate();
    console.log("Public Key:",keypair.publicKey.toString());
    console.log("Secret Key:",keypair.secretKey);
};
generateKey();