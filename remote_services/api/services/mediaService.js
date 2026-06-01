const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

/**
 * MediaService handles IPFS uploads and CID management
 * Provides abstraction over IPFS proxy endpoints
 */
class MediaService {
  constructor(ipfsEndpoint = 'http://ipfs:5001') {
    this.ipfsEndpoint = ipfsEndpoint;
    this.ipfsApiUrl = `${ipfsEndpoint}/api/v0`;
    this.ipfsGatewayUrl = 'https://ipfs.io/ipfs';
  }

  /**
   * Upload a file to IPFS and return CID
   * @param {string} filePath - Path to file on disk
   * @param {object} options - {wrap: boolean, progress: function}
   * @returns {Promise<{cid: string, size: number, url: string}>}
   */
  async uploadToIpfs(filePath, options = {}) {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const fileStream = fs.createReadStream(filePath);
      const form = new FormData();
      form.append('file', fileStream);

      // Add pin=true to persist on the node
      const uploadUrl = `${this.ipfsApiUrl}/add?pin=true`;

      const response = await axios.post(uploadUrl, form, {
        headers: form.getHeaders(),
        timeout: 60000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      const cid = response.data.Hash;
      const size = response.data.Size;

      return {
        cid,
        size,
        url: `${this.ipfsGatewayUrl}/${cid}`,
        publicUrl: `${this.ipfsGatewayUrl}/${cid}`
      };
    } catch (error) {
      console.error('[MediaService] IPFS upload error:', error.message);
      throw error;
    }
  }

  /**
   * Upload multiple files to IPFS (wrapped in a directory)
   * @param {string[]} filePaths - Array of file paths
   * @returns {Promise<{cid: string, files: object[]}>}
   */
  async uploadMultipleToIpfs(filePaths) {
    try {
      const form = new FormData();

      for (const filePath of filePaths) {
        if (!fs.existsSync(filePath)) {
          throw new Error(`File not found: ${filePath}`);
        }
        const fileName = path.basename(filePath);
        const fileStream = fs.createReadStream(filePath);
        form.append('file', fileStream, { filename: fileName });
      }

      // wrap=true creates a directory structure
      const uploadUrl = `${this.ipfsApiUrl}/add?wrap-with-directory=true&pin=true`;

      const response = await axios.post(uploadUrl, form, {
        headers: form.getHeaders(),
        timeout: 60000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      // Last entry is the directory CID
      const entries = Array.isArray(response.data) ? response.data : [response.data];
      const dirEntry = entries[entries.length - 1];

      return {
        cid: dirEntry.Hash,
        files: entries.slice(0, -1).map(e => ({
          name: e.Name,
          cid: e.Hash,
          size: e.Size,
          url: `${this.ipfsGatewayUrl}/${e.Hash}`
        }))
      };
    } catch (error) {
      console.error('[MediaService] Multiple upload error:', error.message);
      throw error;
    }
  }

  /**
   * Verify CID exists on IPFS
   * @param {string} cid - Content ID to verify
   * @returns {Promise<boolean>}
   */
  async verifyCid(cid) {
    try {
      const response = await axios.post(
        `${this.ipfsApiUrl}/files/stat?arg=/ipfs/${cid}`,
        {},
        { timeout: 10000 }
      );
      return response.status === 200;
    } catch (error) {
      console.warn(`[MediaService] CID verification failed for ${cid}:`, error.message);
      return false;
    }
  }

  /**
   * Pin CID to ensure persistence
   * @param {string} cid - Content ID to pin
   * @returns {Promise<{cid: string, pinned: boolean}>}
   */
  async pinCid(cid) {
    try {
      const response = await axios.post(
        `${this.ipfsApiUrl}/pin/add?arg=/ipfs/${cid}`,
        {},
        { timeout: 30000 }
      );

      return {
        cid: response.data.Pins[0] || cid,
        pinned: true
      };
    } catch (error) {
      console.error('[MediaService] Pin error:', error.message);
      throw error;
    }
  }

  /**
   * Get file from IPFS (for verification)
   * @param {string} cid - Content ID
   * @returns {string} - Public URL to access the file
   */
  getPublicUrl(cid) {
    return `${this.ipfsGatewayUrl}/${cid}`;
  }

  /**
   * Clean up temp file
   * @param {string} filePath - Path to file to delete
   */
  cleanupTempFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.warn('[MediaService] Cleanup error:', error.message);
    }
  }
}

module.exports = MediaService;
