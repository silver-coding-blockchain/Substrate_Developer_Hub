import { Connection, PublicKey, Keypair, StakeProgram, LAMPORTS_PER_SOL, Authorized } from '@solana/web3.js'
import walletSecret from './wallet.json'

const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
const wallet = Keypair.fromSecretKey(new Uint8Array(walletSecret));
const stakeAccount = Keypair.generate();
const validatorVoteAccount = new PublicKey("TBD");

async function main() {
    try {
        // Step 1 - Fund the wallet
        console.log("---Step 1---Funding wallet");
        await fundAccount(wallet, 2 * LAMPORTS_PER_SOL);
        // Step 2 - Create the stake account
        console.log("---Step 2---Create Stake Account");
        await createStakeAccount({ wallet, stakeAccount, lamports: 1.9 * LAMPORTS_PER_SOL });
        // Step 3 - Delegate the stake account
        console.log("---Step 3---Delegate Stake Account");
        await delegateStakeAccount({ stakeAccount, validatorVoteAccount, authorized: wallet });
        // Step 4 - Check the stake account
        console.log("---Step 4---Check Stake Account");
        await getStakeAccountInfo(stakeAccount.publicKey);
    } catch (error) {
        console.error(error);
        return;
    }
}

async function fundAccount(accountToFund: Keypair, lamports = LAMPORTS_PER_SOL) {
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    try {
        const signature = await connection.requestAirdrop(accountToFund.publicKey, lamports);
        const result = await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'finalized');
        if (result.value.err) {
            throw new Error(`Failed to confirm airdrop: ${result.value.err}`);
        }
        console.log("Wallet funded", signature);
    }
    catch (error) {
        console.error(error);
    }
    return;
}
async function createStakeAccount({ wallet, stakeAccount, lamports }: { wallet: Keypair, stakeAccount: Keypair, lamports?: number }) {
    async function createStakeAccount({ wallet, stakeAccount, lamports }: { wallet: Keypair, stakeAccount: Keypair, lamports?: number }) {
        const transaction = StakeProgram.createAccount({
            fromPubkey: wallet.publicKey,
            stakePubkey: stakeAccount.publicKey,
            authorized: new Authorized(wallet.publicKey, wallet.publicKey),
            lamports: lamports ?? LAMPORTS_PER_SOL
        });
        try {
            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
            transaction.feePayer = wallet.publicKey;
            transaction.recentBlockhash = blockhash;
            transaction.lastValidBlockHeight = lastValidBlockHeight;
            transaction.sign(wallet, stakeAccount);
            const signature = await connection.sendRawTransaction(transaction.serialize());
            const result = await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'finalized');
            if (result.value.err) {
                throw new Error(`Failed to confirm airdrop: ${result.value.err}`);
            }
            console.log("Stake Account created", signature);
        }
        catch (error) {
            console.error(error);
        }
        return;
    }
}
async function delegateStakeAccount({ stakeAccount, validatorVoteAccount }: { stakeAccount: Keypair, validatorVoteAccount: PublicKey }) {
    const transaction = StakeProgram.delegate({
        stakePubkey: stakeAccount.publicKey,
        authorizedPubkey: authorized.publicKey,
        votePubkey: validatorVoteAccount
    });
    try {
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
        transaction.feePayer = authorized.publicKey;
        transaction.recentBlockhash = blockhash;
        transaction.lastValidBlockHeight = lastValidBlockHeight;
        transaction.sign(authorized);
        const signature = await connection.sendRawTransaction(transaction.serialize());
        const result = await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'finalized');
        if (result.value.err) {
            throw new Error(`Failed to confirm airdrop: ${result.value.err}`);
        }
        console.log("Stake Account delegated to vote account", signature);
    }
    catch (error) {
        console.error(error);
    }
    return;
}
async function getStakeAccountInfo(stakeAccount: PublicKey) {
    try {
        const info = await connection.getStakeActivation(stakeAccount);
        console.log(`Stake account status: ${info.state}`);
    } catch (error) {
        console.error(error);
    }
    return;
}

main();