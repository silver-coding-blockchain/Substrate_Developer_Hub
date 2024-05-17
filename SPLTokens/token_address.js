const { PublicKey } = require('@solana/web3.js');
const { TOKEN_2022_PROGRAM_ID,getAssociatedTokenAddressSync } = require('@solana/spl-token');
const OWNER = new PublicKey('GrfytMSKwA1yfjWErCTgxtECfMEU4o9VqPqYRdJER7tD'); 
const MINT = new PublicKey('2oyt7UiF2nN7GZ1ki5GBhmyLcMvrNnm6MJECC1gUVTqM');    
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
const [address] = PublicKey.findProgramAddressSync(
    [OWNER.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), MINT.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID
);

console.log('Using Solana-Web3.js: ', address.toBase58());

const address2 = getAssociatedTokenAddressSync(MINT, OWNER);

console.log('Using SPL-Token: ', address2.toBase58());
