const { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey } = require('@aptos-labs/ts-sdk');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const NODE_URL = process.env.VITE_APTOS_NODE_URL || 'https://fullnode.testnet.aptoslabs.com/v1';
const NETWORK = process.env.VITE_APTOS_NETWORK || 'testnet';

async function deployContract() {
    try {
        console.log('Starting contract deployment...');

        // Initialize Aptos client
        const config = new AptosConfig({ 
            network: Network[NETWORK.toUpperCase()],
            fullnode: NODE_URL
        });
        const aptos = new Aptos(config);

        // Create or load deployment account
        let account;
        const keyPath = path.join(process.cwd(), 'deployment-key.json');
        
        if (fs.existsSync(keyPath)) {
            console.log('Loading existing deployment account...');
            const keyData = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
            const privateKey = new Ed25519PrivateKey(keyData.privateKey);
            account = Account.fromPrivateKey({ privateKey });
        } else {
            console.log('Creating new deployment account...');
            account = Account.generate();
            
            // Save the key for future use
            const keyData = {
                address: account.accountAddress.toString(),
                privateKey: account.privateKey.toString()
            };
            fs.writeFileSync(keyPath, JSON.stringify(keyData, null, 2));

            console.log('\nNew account created!');
            console.log('Address:', keyData.address);
            console.log('\nINSTRUCTIONS TO GET TESTNET TOKENS:');
            console.log('1. Install Petra Wallet from https://petra.app/');
            console.log('2. Create a new wallet in Petra');
            console.log('3. Click on "Import Private Key" and use this key:');
            console.log(keyData.privateKey);
            console.log('\n4. Once imported, click the faucet button in Petra Wallet to get testnet tokens');
            console.log('5. Wait a few seconds for the tokens to arrive');
            console.log('6. Run this script again\n');
            console.log('IMPORTANT: Save your private key securely and never share it with anyone!\n');
            
            process.exit(0);
        }

        console.log('Using account address:', account.accountAddress.toString());

        try {
            // Check account balance
            const resources = await aptos.getAccountResources({
                accountAddress: account.accountAddress
            });
            
            const accountResource = resources.find(r => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>');
            const balance = BigInt(accountResource?.data.coin?.value || 0);

            if (balance < BigInt(100_000_000)) {
                console.log('\nAccount has insufficient funds.');
                console.log('Current balance:', balance.toString(), 'APT');
                console.log('\nPlease get testnet tokens using Petra Wallet faucet.');
                console.log('1. Open Petra Wallet');
                console.log('2. Click the faucet button');
                console.log('3. Wait a few seconds');
                console.log('4. Run this script again\n');
                process.exit(1);
            }

            console.log('Account balance:', balance.toString(), 'APT');
        } catch (error) {
            if (error.status === 404) {
                console.log('\nAccount not initialized yet.');
                console.log('Please get testnet tokens using Petra Wallet faucet to initialize the account.');
                console.log('1. Open Petra Wallet');
                console.log('2. Click the faucet button');
                console.log('3. Wait a few seconds');
                console.log('4. Run this script again\n');
                process.exit(1);
            }
            throw error;
        }

        // Read contract code and Move.toml
        console.log('Reading contract files...');
        const contractPath = path.join(process.cwd(), 'src', 'blockchain', 'contracts', 'sources', 'TreeNFT.move');
        const moveTomlPath = path.join(process.cwd(), 'src', 'blockchain', 'contracts', 'Move.toml');
        
        const contractCode = fs.readFileSync(contractPath);
        const moveToml = fs.readFileSync(moveTomlPath);

        // Create a temporary directory for the package
        const tempDir = path.join(process.cwd(), 'temp_package');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        // Create the package structure
        const sourceDir = path.join(tempDir, 'sources');
        if (!fs.existsSync(sourceDir)) {
            fs.mkdirSync(sourceDir);
        }

        // Write the contract file and Move.toml
        fs.writeFileSync(path.join(sourceDir, 'TreeNFT.move'), contractCode);
        fs.writeFileSync(path.join(tempDir, 'Move.toml'), moveToml);

        // Create the publish package payload
        console.log('Publishing contract...');
        const payload = {
            function: "0x1::code::publish_package_txn",
            type_arguments: [],
            arguments: [
                Array.from(moveToml),
                [Array.from(contractCode)]
            ]
        };

        console.log('Submitting transaction...');
        const pendingTransaction = await aptos.submitTransaction({
            sender: account,
            data: payload
        });

        console.log('Waiting for transaction confirmation...');
        const result = await aptos.waitForTransaction({
            transactionHash: pendingTransaction.hash
        });

        // Clean up temporary directory
        fs.rmSync(tempDir, { recursive: true, force: true });

        console.log('Contract deployed successfully!');
        console.log('Transaction hash:', pendingTransaction.hash);
        console.log('Contract address:', account.accountAddress.toString());

        // Update .env file with contract address
        const envPath = path.join(process.cwd(), '.env');
        let envContent = fs.readFileSync(envPath, 'utf8');
        
        envContent = envContent.replace(
            /VITE_NFT_CONTRACT_ADDRESS=.*/,
            `VITE_NFT_CONTRACT_ADDRESS=${account.accountAddress.toString()}`
        );
        
        fs.writeFileSync(envPath, envContent);
        console.log('Updated .env file with contract address');

        return {
            success: true,
            contractAddress: account.accountAddress.toString(),
            transactionHash: pendingTransaction.hash
        };
    } catch (error) {
        console.error('Deployment failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Run deployment
deployContract().then((result) => {
    if (result.success) {
        console.log('\nDeployment completed successfully!');
        console.log('Contract address:', result.contractAddress);
        console.log('Transaction hash:', result.transactionHash);
        console.log('\nMake sure to save these details!');
    } else {
        console.error('\nDeployment failed:', result.error);
    }
    process.exit(result.success ? 0 : 1);
}); 