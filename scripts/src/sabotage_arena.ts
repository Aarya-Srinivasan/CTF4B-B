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
const ARENA_ID = "0x6f41426462ec596f7c703b710037a505b060d40237583f80c6604294df051f67"; 

(async () => {
  const tx = new Transaction();
  
  // RUN THIS ONCE FIRST TO REGISTER:
  // tx.moveCall({ target: `${PACKAGE_ID}::sabotage_arena::register`, arguments: [tx.object(ARENA_ID), tx.object('0x6')] });

  // RUN THIS EVERY 10 MINUTES:
  tx.moveCall({
    target: `${PACKAGE_ID}::sabotage_arena::build`,
    arguments: [tx.object(ARENA_ID), tx.object('0x6')],
  });

  const result = await suiClient.signAndExecuteTransaction({ signer: keypair, transaction: tx });
  console.log("Arena build action sent! Digest:", result.digest);
})();