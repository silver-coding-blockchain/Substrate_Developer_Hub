const SOLANA=require('@solana/web3.js');
const {Connection, PublicKey,LAMPORTS_PER_SOL, clusterApiUrl}=SOLANA;
const QUICKNODE_RPC='https://api.devnet.solana.com';
const SOLANA_CONNECTION=new Connection(QUICKNODE_RPC);
const WALLET_ADDRESS='GrfytMSKwA1yfjWErCTgxtECfMEU4o9VqPqYRdJER7tD';
(async()=>{
    let balance=await SOLANA_CONNECTION.getBalance(new PublicKey(WALLET_ADDRESS));
    console.log(`Wallet Balance:${balance/LAMPORTS_PER_SOL}`)
})();

/*curl https://api.mainnet-beta.solana.com -X POST -H '"Content-Type" : "application/json"' -d '
  {
    "jsonrpc": "2.0", "id": 1,
    "method": "getBalance",
    "params": [
      "GrfytMSKwA1yfjWErCTgxtECfMEU4o9VqPqYRdJER7tD"
    ]
  }
'*/