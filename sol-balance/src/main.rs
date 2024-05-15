use solana_sdk::pubkey::Pubkey;
use solana_client::rpc_client::RpcClient;
use std::str::FromStr;

const OWNER:&str="GrfytMSKwA1yfjWErCTgxtECfMEU4o9VqPqYRdJER7tD";
const LAMPORTS_PER_SOL:f64=1_000_000_000.0;
fn main() {
    println!("Hello, world!");
    let owner_pubkey=Pubkey::from_str(OWNER).unwrap();
    let connection=RpcClient::new("https://api.mainnet-beta.solana.com".to_string());
    let balance=connection.get_balance(&owner_pubkey).unwrap() as f64;
    println!("Balance:{}", balance/LAMPORTS_PER_SOL);
}

//https://api.testnet.solana.com/
//https://api.devnet.solana.com/
