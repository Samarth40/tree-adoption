import { PetraWallet } from 'petra-plugin-wallet-adapter';
import { aptos } from '../config/aptosConfig';

// Initialize Petra wallet
const wallet = new PetraWallet();

// Connect wallet
export const connectWallet = async () => {
  try {
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
    const account = await wallet.account();
    return !!account;
  } catch {
    return false;
  }
};

export const getWallet = () => wallet; 