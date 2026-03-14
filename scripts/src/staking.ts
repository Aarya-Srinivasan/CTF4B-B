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
// This is the StakingPool object ID from the deployment
const POOL_ID = "0x6335123512a2083984d72f10b7a8c3d9876543210fedcba9876543210abcdef1"; 

(async () => {
  const tx = new Transaction();
  // We take 1 SUI from your gas to stake
  const [coin] = tx.splitCoins(tx.gas, [1000000000]); 

  tx.moveCall({
    target: `${PACKAGE_ID}::staking::stake`,
    arguments: [tx.object(POOL_ID), coin, tx.object('0x6')],
  });

  const result = await suiClient.signAndExecuteTransaction({ signer: keypair, transaction: tx });
  console.log("Staking transaction sent! Digest:", result.digest);
})();