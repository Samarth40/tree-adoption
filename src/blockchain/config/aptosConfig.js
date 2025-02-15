import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

// Network Configuration
export const APTOS_NETWORK = import.meta.env.VITE_APTOS_NETWORK || 'testnet';
export const APTOS_NODE_URL = import.meta.env.VITE_APTOS_NODE_URL || 'https://fullnode.testnet.aptoslabs.com/v1';
export const APTOS_FAUCET_URL = import.meta.env.VITE_APTOS_FAUCET_URL || 'https://faucet.testnet.aptoslabs.com';

// Initialize Aptos Client
const config = new AptosConfig({ 
    network: Network[APTOS_NETWORK.toUpperCase()],
    fullnode: APTOS_NODE_URL
});
export const aptos = new Aptos(config);

// Contract addresses
export const NFT_CONTRACT_ADDRESS = import.meta.env.VITE_NFT_CONTRACT_ADDRESS;
export const RESOURCE_ACCOUNT_ADDRESS = import.meta.env.VITE_RESOURCE_ACCOUNT_ADDRESS;

// Constants
export const DEFAULT_GAS_LIMIT = 100000;
export const MAX_GAS_AMOUNT = 5000;
export const GAS_PRICE_MULTIPLIER = 1.5; 