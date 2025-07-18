/**
 * NFC Service
 * This service handles NFC token generation and related functionality
 * for the RF1D reader to consume.
 */

// Generate a unique NFC token with required format for RF1D readers
export const generateNFCToken = async () => {
  // Generate a unique identifier
  const uniqueId = generateUniqueId();
  
  // Current timestamp for the token
  const timestamp = new Date().toISOString();
  
  // Get user info from localStorage if available
  const token = localStorage.getItem('token');
  let userId = null;
  
  if (token) {
    try {
      // If you're using JWT, you might want to decode it to get the user ID
      const decoded = JSON.parse(atob(token.split('.')[1]));
      userId = decoded.id;
    } catch (e) {
      console.error('Error extracting user ID from token:', e);
    }
  }
  
  // Create the NFC data structure
  const nfcData = {
    tokenId: uniqueId,
    userId: userId,
    timestamp: timestamp,
    status: 'active',
    type: 'customer',
    // Include additional fields that your RF1D reader might need
    rfidFormat: 'ISO14443A',
    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Valid for 24 hours
  };
  
  // Save to local storage for the reader to access
  localStorage.setItem('nfc_token', JSON.stringify(nfcData));
  
  return nfcData;
};

// Generate a unique ID compatible with RF1D readers
const generateUniqueId = () => {
  // Format: 8 hex digits + 4 hex digits + 4 hex digits + 4 hex digits + 12 hex digits
  const pattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  
  return pattern.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Function to verify an NFC token (for the reader)
export const verifyNFCToken = async (tokenId) => {
  try {
    const response = await fetch(`http://localhost:3002/api/v1/nfc/${tokenId}`);
    if (!response.ok) {
      throw new Error('Token verification failed');
    }
    return await response.json();
  } catch (error) {
    console.error('Error verifying NFC token:', error);
    throw error;
  }
};

// Export the NFC data in a format readable by RF1D readers
export const exportNFCForReader = () => {
  const nfcData = localStorage.getItem('nfc_token');
  if (!nfcData) {
    return null;
  }
  
  const parsedData = JSON.parse(nfcData);
  
  // Format the data for RF1D readers
  // This format might need to be adjusted based on your specific reader requirements
  const readerFormat = {
    id: parsedData.tokenId,
    timestamp: parsedData.timestamp,
    validUntil: parsedData.validUntil,
    format: parsedData.rfidFormat,
    // Add any additional fields required by your reader
  };
  
  return readerFormat;
};