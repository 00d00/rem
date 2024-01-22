const discord = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

module.exports = {
  name: discord.Events.ClientReady,
  async execute(client) {
    console.log('START');
    const files = await fs.readdir('./userdata');

    const jsons = await Promise.all(files.map(async (file) => {
      const filePath = path.join('./userdata', file);

      if (path.extname(filePath).toLowerCase() === '.json') {
        const jsonData = JSON.parse(await fs.readFile(filePath, 'utf-8'));
        return {
          fileName: file,
          data: jsonData,
        };
      } else {
        return null;
      }

      const validJsons = jsons.filter((json) => json !== null);
      validJsons.sort((a, b) => b.data.length - a.data.length);
      console.log(validJsons);
    }));
  }
};