import { Connection, GetProgramAccountsFilter } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
const rpcEndpoint = 'https://light-white-gadget.solana-mainnet.quiknode.pro/12b496f734d940d477f95b9ffdd3a7b9f4845bd6/';
const solanaConnection = new Connection(rpcEndpoint);
const walletToQuery = 'GrfytMSKwA1yfjWErCTgxtECfMEU4o9VqPqYRdJER7tD'; //example: vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg
const MINT_TO_SEARCH = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; //USDC Mint Address

async function getTokenAccounts(wallet: string, solanaConnection: Connection) {
    const filters:GetProgramAccountsFilter[] = [
        {
          dataSize: 165,    //size of account (bytes)
        },
        {
          memcmp: {
            offset: 32,     //location of our query in the account (bytes)
            bytes: wallet,  //our search criteria, a base58 encoded string
          }            
        },
        //  //Add this search parameter
        //  {
        //     memcmp: {
        //     offset: 0, //number of bytes
        //     bytes: MINT_TO_SEARCH, //base58 encoded string
        //     },
        // }
     ];
     const accounts = await solanaConnection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID,   //SPL Token Program, new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
        {filters: filters}
    );
    console.log(`Found ${accounts.length} token account(s) for wallet ${wallet}.`);
    accounts.forEach((account, i) => {
        //Parse the account data
        const parsedAccountInfo:any = account.account.data;
        const mintAddress:string = parsedAccountInfo["parsed"]["info"]["mint"];
        const tokenBalance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
        //Log results
        console.log(`Token Account No. ${i + 1}: ${account.pubkey.toString()}`);
        console.log(`--Token Mint: ${mintAddress}`);
        console.log(`--Token Balance: ${tokenBalance}`);
    });
}
getTokenAccounts(walletToQuery,solanaConnection);