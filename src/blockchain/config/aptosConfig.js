import { AptosClient, Provider } from '@aptos-labs/ts-sdk';

// Network Configuration
export const APTOS_NETWORK = process.env.APTOS_NETWORK || 'testnet';
export const APTOS_NODE_URL = process.env.APTOS_NODE_URL || 'https://fullnode.testnet.aptoslabs.com/v1';
export const APTOS_FAUCET_URL = process.env.APTOS_FAUCET_URL || 'https://faucet.testnet.aptoslabs.com';

// Initialize Aptos Client
export const aptosClient = new AptosClient({ baseUrl: APTOS_NODE_URL });

// Initialize Provider
export const provider = new Provider({
  nodeUrl: APTOS_NODE_URL,
});

// Contract addresses
export const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;
export const RESOURCE_ACCOUNT_ADDRESS = process.env.RESOURCE_ACCOUNT_ADDRESS;

// Constants
export const DEFAULT_GAS_LIMIT = 100000;
export const MAX_GAS_AMOUNT = 5000;
export const GAS_PRICE_MULTIPLIER = 1.5; 