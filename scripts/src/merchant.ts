import { SuiGrpcClient } from '@mysten/sui/grpc';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import keyPairJson from "../keypair.json" with { type: "json" };

const keypair = Ed25519Keypair.fromSecretKey(keyPairJson.privateKey);
const suiClient = new SuiGrpcClient({
	network: 'testnet',
	baseUrl: 'https://fullnode.testnet.sui.io:443',
});

const PACKAGE_ID = "0x936313e502e9cbf6e7a04fe2aeb4c60bc0acd69729acc7a19921b33bebf72d03";
const USDC_COIN_ID = "PASTE_YOUR_USDC_COIN_OBJECT_ID"; // Find this on Suiscan

(async () => {
  const tx = new Transaction();
  const [payment] = tx.splitCoins(tx.object(USDC_COIN_ID), [3849000]);

  tx.moveCall({
    target: `${PACKAGE_ID}::merchant::buy_flag`,
    arguments: [payment],
  });

  const result = await suiClient.signAndExecuteTransaction({ signer: keypair, transaction: tx });
  console.log("Merchant flag purchased! Digest:", result.digest);
})();