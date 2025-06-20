const fs = require('fs').promises; // Use the promises-based API
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'data.json'); // Define path once

const readData = async () => {
    try {
        const jsonData = await fs.readFile(dataPath, 'utf8');
        return JSON.parse(jsonData);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        console.error('Error reading data:', error);
        throw error;
    }
};

const writeData = async (data) => {
    try {
        await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing data:', error);
        throw error; 
    }
};

module.exports = {
    readData, writeData
};