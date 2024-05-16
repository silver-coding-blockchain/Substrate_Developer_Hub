import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, TransactionInstruction, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
const QUICKNODE_RPC = 'https://necessary-spring-shard.solana-devnet.quiknode.pro/0417dc7b4af48216baf61e31edbabb9a71579a91/';
const SOLANA_CONNECTION = new Connection(QUICKNODE_RPC);
const DESTINATION_WALLET = Keypair.generate();
const signerkey=new PublicKey('GrfytMSKwA1yfjWErCTgxtECfMEU4o9VqPqYRdJER7tD');
const SIGNER_WALLET=Keypair.fromSecretKey(new Uint8Array([]));
const destinationkey=new PublicKey('HpuaL2sndmY8uD1JtwJkgM3YxQDqWS2Yzyz3zejVRJCF');
const INSTRUCTIONS: TransactionInstruction = 
    SystemProgram.transfer({
        fromPubkey: signerkey,
        toPubkey: destinationkey,
        lamports: 0.01 * LAMPORTS_PER_SOL,
    });
const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

async function isBlockhashExpired(connection: Connection, lastValidBlockHeight: number) {
    let currentBlockHeight = (await connection.getBlockHeight('finalized'));
    console.log('                           ');
    console.log('Current Block height:             ', currentBlockHeight);
    console.log('Last Valid Block height - 150:     ', lastValidBlockHeight - 150);
    console.log('--------------------------------------------');    
    console.log('Difference:                      ',currentBlockHeight - (lastValidBlockHeight-150)); // If Difference is positive, blockhash has expired.
    console.log('                           ');

    return (currentBlockHeight > lastValidBlockHeight - 150);
}
(async()=>{
    // Step 1 - Get Latest Blockhash
    const blockhashResponse = await SOLANA_CONNECTION.getLatestBlockhashAndContext('finalized');
    const lastValidHeight = blockhashResponse.value.lastValidBlockHeight; 

    // Step 2 - Create a SOL Transfer Transaction
    const messageV0 = new TransactionMessage({
        payerKey: signerkey,
        recentBlockhash: blockhashResponse.value.blockhash,
        instructions: [INSTRUCTIONS]
    }).compileToV0Message();
    const transaction = new VersionedTransaction(messageV0);
    transaction.sign([SIGNER_WALLET]);
    const START_TIME = new Date();
    // Step 3 - Send Transaction to the Network
    const txId = await SOLANA_CONNECTION.sendTransaction(transaction);
    // Step 4 - Check transaction status and blockhash status until the transaction succeeds or blockhash expires
    let hashExpired = false;
    let txSuccess = false;
    while (!hashExpired && !txSuccess) {
        const { value: status } = await SOLANA_CONNECTION.getSignatureStatus(txId);
        
        // Break loop if transaction has succeeded
        if (status && ((status.confirmationStatus === 'confirmed' || status.confirmationStatus === 'finalized'))) {
            txSuccess = true;
            const endTime = new Date();
            const elapsed = (endTime.getTime() - START_TIME.getTime())/1000;
            console.log(`Transaction Success. Elapsed time: ${elapsed} seconds.`);
            console.log(`https://explorer.solana.com/tx/${txId}?cluster=devnet`);
            break;
        }
        hashExpired = await isBlockhashExpired(SOLANA_CONNECTION, lastValidHeight);
        // Break loop if blockhash has expired
        if (hashExpired) {
            const endTime = new Date();
            const elapsed = (endTime.getTime() - START_TIME.getTime())/1000;
            console.log(`Blockhash has expired. Elapsed time: ${elapsed} seconds.`);
            // (add your own logic to Fetch a new blockhash and resend the transaction or throw an error)
            break;
        }

        // Check again after 2.5 sec
        await sleep(100);
    }
})();