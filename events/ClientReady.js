const discord = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

module.exports = {
  name: discord.Events.ClientReady,
  async execute(client) {
    let total = [];
    const dataDirectory = 'userdata';

    const files = await fs.readdir(dataDirectory);

    for ( const file of files.filter(file => file.endsWith('.json')) ) {
      const data = await fs.readFile(path.join(dataDirectory, file), 'utf8');
      const jsonData = JSON.parse(data);
      total = total.concat(Object.keys(jsonData));
    }

    total = total.filter((value, index, self) => self.indexOf(value) === index);
  }
};