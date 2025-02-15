# Blockchain Implementation Guide for Tree Adoption Platform

## 1. Project Structure
```typescript
project/
├── src/
│   ├── blockchain/
│   │   ├── config/
│   │   │   ├── aptosConfig.ts          // Aptos network configuration
│   │   │   └── constants.ts            // Blockchain constants
│   │   ├── contracts/
│   │   │   ├── TreeNFT.move           // NFT smart contract
│   │   │   └── ResourceAccount.move    // Resource account management
│   │   ├── services/
│   │   │   ├── aptosService.ts        // Aptos interaction methods
│   │   │   ├── nftService.ts          // NFT operations
│   │   │   └── ipfsService.ts         // IPFS storage handling
│   │   └── utils/
│   │       ├── walletUtils.ts         // Wallet helper functions
│   │       └── transactionUtils.ts    // Transaction helpers
```

## 2. Required Dependencies
```json
{
  "dependencies": {
    "@aptos-labs/wallet-adapter-react": "^1.0.0",
    "@aptos-labs/ts-sdk": "^1.0.0",
    "petra-plugin-wallet-adapter": "^0.1.0",
    "ipfs-http-client": "^60.0.0",
    "web3.storage": "^4.5.0"
  }
}
```

## 3. Smart Contract Structure (Move)
```move
module tree_nft {
    struct TreeNFT has key {
        tree_id: String,
        metadata_uri: String,
        owner: address,
        minting_date: u64,
        environmental_impact: u64,
    }

    public fun mint_tree_nft(
        tree_id: String,
        metadata_uri: String,
        environmental_impact: u64
    ): TreeNFT {
        // Minting logic
    }
}
```

## 4. Firebase Collections Structure
```typescript
interface FirestoreStructure {
  users: {
    [userId: string]: {
      wallet_address: string;
      nft_collection: {
        [tokenId: string]: {
          tree_id: string;
          mint_date: timestamp;
          transaction_hash: string;
          metadata_uri: string;
          environmental_impact: number;
        }
      }
    }
  }
  trees: {
    [treeId: string]: {
      nft_status: 'minted' | 'available' | 'processing';
      token_id?: string;
      owner_address?: string;
    }
  }
}
```

## 5. Component Implementation Checklist

### 5.1 Wallet Connection
- [ ] Implement WalletConnect component
- [ ] Add wallet state management
- [ ] Handle connection errors
- [ ] Store wallet address in Firebase

### 5.2 NFT Minting
- [ ] Create minting interface
- [ ] Implement metadata generation
- [ ] Add IPFS upload functionality
- [ ] Handle minting transactions
- [ ] Update Firebase records

### 5.3 NFT Display
- [ ] Create NFT card component
- [ ] Implement collection view
- [ ] Add NFT details page
- [ ] Show transaction history

## 6. API Endpoints Required
```typescript
interface BlockchainAPI {
  // Wallet
  connectWallet(): Promise<string>;
  disconnectWallet(): void;
  
  // NFT Operations
  mintNFT(treeId: string, metadata: NFTMetadata): Promise<string>;
  getNFTCollection(address: string): Promise<NFT[]>;
  getNFTDetails(tokenId: string): Promise<NFTDetails>;
  
  // Transactions
  getTransactionStatus(hash: string): Promise<TransactionStatus>;
}
```

## 7. Environment Variables
```env
# Aptos Configuration
APTOS_NODE_URL=https://fullnode.testnet.aptoslabs.com/v1
APTOS_FAUCET_URL=https://faucet.testnet.aptoslabs.com
APTOS_NETWORK=testnet

# IPFS Configuration
IPFS_PROJECT_ID=your_project_id
IPFS_PROJECT_SECRET=your_project_secret
IPFS_GATEWAY=https://ipfs.io/ipfs/

# Contract Addresses
NFT_CONTRACT_ADDRESS=0x...
RESOURCE_ACCOUNT_ADDRESS=0x...
```

## 8. Error Handling Scenarios
```typescript
const ErrorTypes = {
  WALLET_CONNECTION: {
    code: 'W001',
    message: 'Failed to connect wallet'
  },
  TRANSACTION_FAILED: {
    code: 'T001',
    message: 'Transaction failed'
  },
  IPFS_UPLOAD: {
    code: 'I001',
    message: 'Failed to upload to IPFS'
  }
  // Add more error types
}
```

## 9. Testing Strategy
- [ ] Smart contract unit tests
- [ ] Wallet connection tests
- [ ] Transaction flow tests
- [ ] IPFS upload tests
- [ ] Integration tests
- [ ] UI component tests

## 10. Performance Optimization
- Implement caching for NFT metadata
- Batch blockchain queries
- Optimize IPFS uploads
- Use Firebase offline persistence
- Implement lazy loading for NFT images

## 11. Security Considerations
- Validate all transactions
- Implement rate limiting
- Add transaction confirmation steps
- Secure metadata storage
- Implement error recovery

## 12. User Flow States
```typescript
enum UserFlowState {
  WALLET_DISCONNECTED,
  WALLET_CONNECTING,
  WALLET_CONNECTED,
  MINTING_PREPARING,
  MINTING_IN_PROGRESS,
  MINTING_COMPLETE,
  MINTING_FAILED
}
```

## 13. Implementation Phases
1. Basic Wallet Integration
2. Smart Contract Deployment
3. NFT Minting Implementation
4. Collection Display
5. Transaction History
6. Environmental Impact Tracking

## 14. Monitoring & Analytics
- Track successful mints
- Monitor failed transactions
- Measure gas usage
- Track user engagement
- Monitor IPFS performance

## Notes:
- Always test on testnet first
- Keep gas fees optimized
- Maintain proper error logging
- Update Firebase rules for security
- Regular smart contract audits 