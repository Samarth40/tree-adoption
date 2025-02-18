import { PetraWallet } from 'petra-plugin-wallet-adapter';
import { aptos } from '../config/aptosConfig';

// Initialize Petra wallet
let wallet = null;

// Initialize wallet
const initializeWallet = () => {
  if (!wallet && window.petra) {
    wallet = new PetraWallet();
  }
  return wallet;
};

// Connect wallet
export const connectWallet = async () => {
  try {
    // Initialize wallet if not already initialized
    wallet = initializeWallet();
    
    if (!wallet) {
      throw new Error('Petra wallet not found. Please install Petra wallet extension.');
    }

    await wallet.connect();
    const account = await wallet.account();
    return account;
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

// Disconnect wallet
export const disconnectWallet = async () => {
  try {
    if (!wallet) {
      return;
    }
    await wallet.disconnect();
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
    throw error;
  }
};

// Get wallet balance
export const getWalletBalance = async (address) => {
  try {
    const resources = await aptos.getAccountResources({
      accountAddress: address
    });
    const aptosCoin = resources.find(r => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>');
    return aptosCoin?.data?.coin?.value || '0';
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    throw error;
  }
};

// Check if wallet is connected
export const isWalletConnected = async () => {
  try {
    wallet = initializeWallet();
    if (!wallet) {
      return false;
    }
    const account = await wallet.account();
    return !!account;
  } catch {
    return false;
  }
};

// Get wallet instance
export const getWallet = () => {
  return initializeWallet();
}; 