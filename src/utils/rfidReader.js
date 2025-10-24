/**
 * RF1D Reader Interface
 * This file provides the interface for RF1D readers to interact with the NFC tokens
 */

import { verifyNFCToken, exportNFCForReader } from '../services/nfcService';
import config from '../config/apiConfig';

// Function to read NFC data when a card is presented to the reader
export const readNFCCard = async (cardId) => {
  try {
    // Verify the token with the backend
    const tokenData = await verifyNFCToken(cardId);
    
    if (!tokenData || tokenData.status !== 'active') {
      console.error('Invalid or inactive NFC token');
      return {
        valid: false,
        message: 'Invalid or inactive NFC token',
      };
    }
    
    // Check if the token is expired
    const validUntil = new Date(tokenData.validUntil);
    if (validUntil < new Date()) {
      console.error('NFC token has expired');
      return {
        valid: false,
        message: 'NFC token has expired',
      };
    }
    
    // Return success with the token data
    return {
      valid: true,
      data: tokenData,
      message: 'NFC token validated successfully',
    };
  } catch (error) {
    console.error('Error reading NFC card:', error);
    return {
      valid: false,
      message: 'Error reading NFC card',
      error: error.message,
    };
  }
};

// Function to get the current active NFC token for the reader
export const getCurrentNFCToken = () => {
  return exportNFCForReader();
};

// Function to process a transaction using the NFC token
export const processNFCTransaction = async (cardId, transactionData) => {
  try {
    // First verify the card
    const verification = await readNFCCard(cardId);
    
    if (!verification.valid) {
      return verification; // Return the error
    }
    
    // Process the transaction with your API
    const response = await fetch(config.endpoints.transactions, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nfcToken: cardId,
        ...transactionData,
        timestamp: new Date().toISOString(),
      }),
    });
    
    if (!response.ok) {
      throw new Error('Transaction processing failed');
    }
    
    const result = await response.json();
    
    return {
      valid: true,
      transactionId: result.id,
      message: 'Transaction processed successfully',
    };
  } catch (error) {
    console.error('Error processing NFC transaction:', error);
    return {
      valid: false,
      message: 'Error processing transaction',
      error: error.message,
    };
  }
};