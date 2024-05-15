import { Connection, PublicKey, LAMPORTS_PER_SOL, } from "@solana/web3.js";

const HTTP_ENDPOINT = 'https://api.devnet.solana.com'; 
const solanaConnection = new Connection(HTTP_ENDPOINT);
const sleep = (ms:number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    const ACCOUNT_TO_WATCH = new PublicKey('GrfytMSKwA1yfjWErCTgxtECfMEU4o9VqPqYRdJER7tD');
    const subscriptionId = await solanaConnection.onAccountChange(
        ACCOUNT_TO_WATCH,
        (updatedAccountInfo) =>
            console.log(`---Event Notification for ${ACCOUNT_TO_WATCH.toString()}--- \nNew Account Balance:`, updatedAccountInfo.lamports / LAMPORTS_PER_SOL, ' SOL'),
        "confirmed"
    );
    console.log('Starting web socket, subscription ID: ', subscriptionId);
    await sleep(10000); //Wait 10 seconds for Socket Testing
    await solanaConnection.requestAirdrop(ACCOUNT_TO_WATCH, 10*LAMPORTS_PER_SOL);
    await solanaConnection.removeAccountChangeListener(subscriptionId);
    console.log(`Websocket ID: ${subscriptionId} closed.`);
})()