const { Connection, PublicKey } = require('@solana/web3.js');
const { getAccount, getMint } = require('@solana/spl-token');
const QUICKNODE_RPC = 'https://light-white-gadget.solana-mainnet.quiknode.pro/12b496f734d940d477f95b9ffdd3a7b9f4845bd6/'; 
const SOLANA_CONNECTION = new Connection(QUICKNODE_RPC);
const TOKEN_ADDRESS = new PublicKey('2DWSd28mLPJJYy2R7h16jEVuMB6xhiqMnTGw67xmX1Gr'); 

async function getTokenBalanceWeb3(connection, tokenAccount) {
    const info = await connection.getTokenAccountBalance(tokenAccount);
    if (info.value.uiAmount == null) throw new Error('No balance found');
    console.log('Balance (using Solana-Web3.js): ', info.value.uiAmount);
    return info.value.uiAmount;
}

getTokenBalanceWeb3(SOLANA_CONNECTION, TOKEN_ADDRESS).catch(err => console.log(err));

async function getTokenBalanceSpl(connection, tokenAccount) {
    const info = await getAccount(connection, tokenAccount);
    const amount = Number(info.amount);
    const mint = await getMint(connection, info.mint);
    const balance = amount / (10 ** mint.decimals);
    console.log('Balance (using Solana-Web3.js): ', balance);
    return balance;
}

getTokenBalanceSpl(SOLANA_CONNECTION, TOKEN_ADDRESS).catch(err => console.log(err));