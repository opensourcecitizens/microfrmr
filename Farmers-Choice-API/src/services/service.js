// service.js
// This file contains the service functions for the application.
// It includes functions to read and write data files in the appData folder.
// It is responsible for handling file operations and data management.

const fs = require('fs');
const path = require('path');

// Path to the appData folder
const appDataPath = path.join(__dirname, '../../appData');

/**
 * Reads a JSON file from the appData folder.
 * @param {string} fileName - The name of the file to read.
 * @returns {Object} - Parsed JSON data.
 */
const readDataFile = (fileName) => {
  try {
    const filePath = path.join(appDataPath, fileName);
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`Error reading file ${fileName}:`, error);
    throw new Error('Failed to read data file');
  }
};

module.exports = { readDataFile };