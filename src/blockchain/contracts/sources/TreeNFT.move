module tree_adoption::tree_nft {
    use std::string::String;
    use std::error;
    use std::signer;
    use std::vector;
    use aptos_framework::account;
    use aptos_framework::event;
    use aptos_framework::timestamp;

    // Errors
    const ENOT_AUTHORIZED: u64 = 1;
    const ETREE_ALREADY_MINTED: u64 = 2;
    const ETREE_NOT_FOUND: u64 = 3;

    struct TreeNFTCollection has key {
        minted_trees: vector<TreeNFT>,
        mint_events: event::EventHandle<MintTreeNFTEvent>,
        transfer_events: event::EventHandle<TransferTreeNFTEvent>
    }

    struct TreeNFT has store, drop {
        tree_id: String,
        metadata_uri: String,
        owner: address,
        minting_date: u64,
        environmental_impact: u64,
    }

    struct MintTreeNFTEvent has drop, store {
        tree_id: String,
        owner: address,
        timestamp: u64,
    }

    struct TransferTreeNFTEvent has drop, store {
        tree_id: String,
        from: address,
        to: address,
        timestamp: u64,
    }

    fun init_module(account: &signer) {
        move_to(account, TreeNFTCollection {
            minted_trees: vector::empty(),
            mint_events: account::new_event_handle<MintTreeNFTEvent>(account),
            transfer_events: account::new_event_handle<TransferTreeNFTEvent>(account)
        });
    }

    public entry fun mint_tree_nft(
        account: &signer,
        tree_id: String,
        metadata_uri: String,
        environmental_impact: u64
    ) acquires TreeNFTCollection {
        let owner_addr = signer::address_of(account);
        
        // Get the collection
        let collection = borrow_global_mut<TreeNFTCollection>(@tree_adoption);
        
        // Verify tree hasnt been minted
        assert!(
            !vector::any(&collection.minted_trees, |t| t.tree_id == tree_id), 
            error::already_exists(ETREE_ALREADY_MINTED)
        );

        // Create new NFT
        let nft = TreeNFT {
            tree_id,
            metadata_uri,
            owner: owner_addr,
            minting_date: timestamp::now_seconds(),
            environmental_impact,
        };

        // Add to collection
        vector::push_back(&mut collection.minted_trees, nft);

        // Emit mint event
        event::emit_event(
            &mut collection.mint_events,
            MintTreeNFTEvent {
                tree_id: tree_id,
                owner: owner_addr,
                timestamp: timestamp::now_seconds(),
            }
        );
    }

    public entry fun transfer_tree_nft(
        from: &signer,
        to: address,
        tree_id: String
    ) acquires TreeNFTCollection {
        let from_addr = signer::address_of(from);
        
        // Get the collection
        let collection = borrow_global_mut<TreeNFTCollection>(@tree_adoption);
        
        // Find and update the NFT
        let found = false;
        let len = vector::length(&collection.minted_trees);
        let i = 0;
        while (i < len) {
            let nft = vector::borrow_mut(&mut collection.minted_trees, i);
            if (nft.tree_id == tree_id) {
                assert!(nft.owner == from_addr, error::permission_denied(ENOT_AUTHORIZED));
                nft.owner = to;
                found = true;
                break
            };
            i = i + 1;
        };
        assert!(found, error::not_found(ETREE_NOT_FOUND));

        // Emit transfer event
        event::emit_event(
            &mut collection.transfer_events,
            TransferTreeNFTEvent {
                tree_id: tree_id,
                from: from_addr,
                to,
                timestamp: timestamp::now_seconds(),
            }
        );
    }

    public entry fun burn_tree_nft(
        owner: &signer,
        tree_id: String
    ) acquires TreeNFTCollection {
        let owner_addr = signer::address_of(owner);
        
        // Get the collection
        let collection = borrow_global_mut<TreeNFTCollection>(@tree_adoption);
        
        // Find and remove the NFT
        let found = false;
        let len = vector::length(&collection.minted_trees);
        let i = 0;
        while (i < len) {
            let nft = vector::borrow(&collection.minted_trees, i);
            if (nft.tree_id == tree_id) {
                assert!(nft.owner == owner_addr, error::permission_denied(ENOT_AUTHORIZED));
                vector::remove(&mut collection.minted_trees, i);
                found = true;
                break
            };
            i = i + 1;
        };
        assert!(found, error::not_found(ETREE_NOT_FOUND));

        // Emit transfer event to burn address
        event::emit_event(
            &mut collection.transfer_events,
            TransferTreeNFTEvent {
                tree_id: tree_id,
                from: owner_addr,
                to: @0x0,
                timestamp: timestamp::now_seconds(),
            }
        );
    }

    #[view]
    public fun get_tree_nft(tree_id: String): (address, u64, u64) acquires TreeNFTCollection {
        let collection = borrow_global<TreeNFTCollection>(@tree_adoption);
        let len = vector::length(&collection.minted_trees);
        let i = 0;
        while (i < len) {
            let nft = vector::borrow(&collection.minted_trees, i);
            if (nft.tree_id == tree_id) {
                return (nft.owner, nft.minting_date, nft.environmental_impact)
            };
            i = i + 1;
        };
        abort error::not_found(ETREE_NOT_FOUND)
    }

    #[view]
    public fun get_owner_trees(owner: address): vector<String> acquires TreeNFTCollection {
        let collection = borrow_global<TreeNFTCollection>(@tree_adoption);
        let result = vector::empty();
        let len = vector::length(&collection.minted_trees);
        let i = 0;
        while (i < len) {
            let nft = vector::borrow(&collection.minted_trees, i);
            if (nft.owner == owner) {
                vector::push_back(&mut result, nft.tree_id);
            };
            i = i + 1;
        };
        result
    }
} 