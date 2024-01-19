const discord = require('discord.js');

module.exports = {
  name: discord.Events.ClientReady,
  async execute(client, guild) {
    client.guilds.cache.forEach(async (guild) => {
      console.log(`NAME: ${guild.name}, ID: ${guild.id}, OWNER: ${guild.ownerId}`);
    });
  }
};