const fs = require('fs');
const path = require('path');

const dataPath = path.resolve('appData'); // Ensure this points to the correct folder

const readDataFile = (fileName) => {
  try {
    const filePath = path.join(dataPath, fileName);
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Failed to read file: ${fileName}`);
  }
};

const writeDataFile = (fileName, data) => {
  try {
    const filePath = path.join(dataPath, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    throw new Error(`Failed to write file: ${fileName}`);
  }
};

module.exports = { readDataFile, writeDataFile };