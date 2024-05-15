const SOLANA=require("@solana/web3.js");
const { Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction } =SOLANA;

const QUICKNODE_RPC = 'https://api.devnet.solana.com';
const SOLANA_CONNECTION = new Connection(QUICKNODE_RPC);
const secret = [83,74,1,192,10,99,242,107,84,243,216,194,166,13,238,94,117,136,1,91,176,211,90,107,208,130,119,221,80,239,49,26,235,152,214,217,43,170,89,5,68,210,155,188,15,17,123,49,137,101,57,179,1,78,218,127,207,206,250,144,96,47,59,162]; // Replace with your secret
const fromKeypair = Keypair.fromSecretKey(new Uint8Array(secret));
async function logMemo (message) {  
    // 1. Create Solana Transaction
    let tx = new Transaction();

    // 2. Add Memo Instruction
    await tx.add(
        new TransactionInstruction({
          keys: [{ pubkey: fromKeypair.publicKey, isSigner: true, isWritable: true }],
          data: Buffer.from(message, "utf-8"),
          programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
        })
      )
    // 3. Send Transaction
    let result = await sendAndConfirmTransaction(SOLANA_CONNECTION, tx, [fromKeypair]);
    // 4. Log Tx URL
    console.log("complete: ", `https://explorer.solana.com/tx/${result}?cluster=devnet`);
    return result;
}
async function fetchMemo() {
    const wallet = fromKeypair.publicKey;
    let signatureDetail = await SOLANA_CONNECTION.getSignaturesForAddress(wallet);
    console.log('Fetched Memo: ', signatureDetail[0].memo);
}
//logMemo("QuickNode Memo Guide Test");
fetchMemo();