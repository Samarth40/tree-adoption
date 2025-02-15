import { Web3Storage } from 'web3.storage';

const client = new Web3Storage({ token: process.env.IPFS_PROJECT_SECRET });

// Upload file to IPFS
export const uploadToIPFS = async (data) => {
    try {
        // Convert data to File object
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const files = [new File([blob], 'metadata.json')];
        
        // Upload to IPFS
        const cid = await client.put(files);
        return `https://ipfs.io/ipfs/${cid}/metadata.json`;
    } catch (error) {
        console.error('Error uploading to IPFS:', error);
        throw error;
    }
};

// Get data from IPFS
export const getFromIPFS = async (cid) => {
    try {
        const res = await client.get(cid);
        if (!res.ok) {
            throw new Error(`Failed to get ${cid}`);
        }
        
        const files = await res.files();
        const file = files[0];
        const content = await file.text();
        return JSON.parse(content);
    } catch (error) {
        console.error('Error getting from IPFS:', error);
        throw error;
    }
}; 