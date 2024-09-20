import MintDealsNftABI from "../abi/MintDealsNFT.js";
import { mintDealsNFTAddress } from "../lib/address";

const getTokenIdFromEvent = async (dealId) => {
  try {
    if (typeof window.tronWeb === "undefined") {
      throw new Error("TronLink is not installed or TronWeb is not available.");
    }

    const tronWeb = window.tronWeb;

    if (!tronWeb.defaultAddress.base58) {
      throw new Error("User is not logged in to TronLink.");
    }

    let recipientAddress = tronWeb.defaultAddress.base58;

    // Create contract instance
    const contract = await tronWeb.contract(
      MintDealsNftABI,
      mintDealsNFTAddress
    );

    let eventResult = await tronWeb.getEventResult(mintDealsNFTAddress, {
      eventName: "NFTMinted",
      size: 100,
    });
    console.log(eventResult);
    let clubId = null;
    if (eventResult.length > 0) {
      for (let index = 0; index < eventResult.length; index++) {
        const event = eventResult[index];
        const eventTrxn = event.transaction;
        if (eventTrxn == txId) {
          clubId = event.result.clubId;
          break;
        }
      }
    }

    // Filter past events for NFTMinted
    const events = await contract.getPastEvents("NFTMinted", {
      filter: { recipient: recipientAddress },
      fromBlock: 0, // Adjust this as needed
      toBlock: "latest",
    });

    // Loop through events and find the one with matching dealId
    for (let event of events) {
      const { recipient, tokenId, dealId: emittedDealId } = event.returnValues;
      if (emittedDealId === dealId && recipient === recipientAddress) {
        return tokenId; // Return the matching tokenId
      }
    }

    // If no matching event is found
    return null;
  } catch (error) {
    console.error("Error fetching tokenId from event:", error);
    throw error;
  }
};

const getNFTsAndDealIdsInWallet = async () => {
  try {
    // Ensure TronLink is installed
    if (!window.tronWeb || !window.tronWeb.ready) {
      throw new Error("TronLink is not available or connected.");
    }

    let contractAddress = mintDealsNFTAddress;

    const walletAddress = window.tronWeb.defaultAddress.base58; // Get user's wallet address
    const contract = await tronWeb.contract().at(contractAddress); // Get contract instance

    // Get the number of NFTs owned by the wallet
    const balance = await contract.balanceOf(walletAddress).call();
    const nftCount = balance.toNumber();

    let nftData = [];

    // Loop through the NFTs owned by the wallet
    for (let i = 0; i < nftCount; i++) {
      const tokenId = await contract
        .tokenOfOwnerByIndex(walletAddress, i)
        .call();
      const dealId = await contract.dealIds(tokenId).call(); // Fetch the dealId associated with the tokenId
      nftData.push({
        tokenId: tokenId.toString(),
        dealId: dealId.toString(),
      });
    }

    return nftData; // Return array of objects with tokenId and dealId
  } catch (error) {
    console.error("Error fetching NFTs and dealIds:", error);
    return [];
  }
};

const getNFTTokensForDeal = async (dealId) => {
  try {
    if (typeof window.tronWeb === "undefined") {
      throw new Error("TronLink is not installed or TronWeb is not available.");
    }

    const tronWeb = window.tronWeb;

    if (!tronWeb.defaultAddress.base58) {
      throw new Error("User is not logged in to TronLink.");
    }

    let recipientAddress = tronWeb.defaultAddress.base58;
    let contractAddress = mintDealsNFTAddress;

    // Fetch all events related to the contract
    const events = await tronWeb.getEventResult(contractAddress, {
      eventName: "NFTMinted",
      size: 20000, // You can adjust the size to control how many events are retrieved
      onlyConfirmed: true, // Only get confirmed events
      sort: "block_timestamp", // Sort events by timestamp
    });

    // Loop through the events and find the one matching recipientAddress and dealId
    let tokens = [];
    for (let event of events) {
      const { result } = event;
      const { recipient, tokenId, dealId: emittedDealId } = result;

      // Check if recipient and dealId match
      if (
        tronWeb.address.fromHex(recipient) === recipientAddress &&
        emittedDealId === dealId
      ) {
        let address_ = tronWeb.address.fromHex(recipient);
        tokens.push({
          address_,
          tokenId,
          dealId,
        });
      }
    }

    return tokens;
  } catch (error) {
    console.error("Error fetching tokenId from event:", error);
    throw error;
  }
};

const requestRedemption = async (tokenId) => {
  try {
    debugger;
    // Ensure TronLink is available
    if (!window.tronWeb || !window.tronWeb.ready) {
      throw new Error("TronLink is not available or not logged in");
    }

    if (!tronWeb.defaultAddress.base58) {
      throw new Error("User is not logged in to TronLink.");
    }

    let contractAddress = mintDealsNFTAddress;

    // Get contract instance via TronLink's tronWeb
    const contract = await window.tronWeb.contract().at(contractAddress);

    // Send the requestRedemption transaction
    const transaction = await contract.requestRedemption(tokenId).send({
      feeLimit: 10000000, // Set the fee limit
      callValue: 0,
      shouldPollResponse: false, // Wait for confirmation
    });

    // Return the transaction ID
    return transaction;
  } catch (error) {
    console.error("Error requesting redemption:", error);
    throw error;
  }
};

const getRedeemRequestsForHolder = async (contractAddress, holderAddress) => {
  try {
    // Ensure TronLink is available
    if (!window.tronWeb || !window.tronWeb.ready) {
      throw new Error("TronLink is not available or not logged in");
    }

    // Get the last 100 RedeemRequest events from the contract
    const allEvents = await window.tronWeb.getEventResult(contractAddress, {
      eventName: "RedeemRequest",
      size: 1000, // Retrieve the last 100 events
    });

    // Filter events by holder's address and extract tokenIds
    let events;
    if (holderAddress) {
      events = allEvents.filter(
        (event) =>
          event.result.holder.toLowerCase() === holderAddress.toLowerCase()
      );
    } else events = allEvents;

    const redeemRequests = events.map((event) => ({
      holder: event.result.holder,
      tokenId: event.result.tokenId,
      transactionId: event.transaction_id, // Optional: transaction ID associated with the event
    }));

    return redeemRequests;
  } catch (error) {
    console.error("Error retrieving RedeemRequest events:", error);
    throw error;
  }
};

export {
  getTokenIdFromEvent,
  getNFTTokensForDeal,
  requestRedemption,
  getNFTsAndDealIdsInWallet,
};