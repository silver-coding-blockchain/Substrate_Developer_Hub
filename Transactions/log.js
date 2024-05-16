const solana=require("@solana/web3.js");
const searchAddress="GrfytMSKwA1yfjWErCTgxtECfMEU4o9VqPqYRdJER7tD";
const connection=new solana.Connection('https://necessary-spring-shard.solana-devnet.quiknode.pro/0417dc7b4af48216baf61e31edbabb9a71579a91/');

const getTransactions=async(address, numTx)=>{
    const pubKey=new solana.PublicKey(address);
    let transactionList=await connection.getSignaturesForAddress(pubKey, {limit:numTx});
    let signatureList=transactionList.map(transaction=>transaction.signature);
    console.log(signatureList);
    let transactionDetails=await connection.getParsedTransactions(signatureList,{maxSupportedTransactionVersion:0});

    transactionList.forEach((transaction,i)=>{
        const date=new Date(transaction.blockTime*1000);
        console.log(`Transaction No: ${i+1}`);
        console.log(`Signature: ${transaction.signature}`);
        console.log(`Time: ${date}`);
        console.log(`Status: ${transaction.confirmationStatus}`);
        const transactionInstructions=transactionDetails[i].transaction.message.instructions;
        transactionInstructions.forEach((instruction, n)=>{
            console.log(`---Instructions ${n+1}: ${instruction.programId.toString()}`);
        })
        console.log(("-").repeat(20));
    })
};

getTransactions(searchAddress,5);