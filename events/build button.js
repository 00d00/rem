const discord = require('discord.js');

module.exports = {
  name: discord.Events.MessageCreate,
  async execute(message) {
    if (message.content === '!build button') {
      const guilds = new discord.ButtonBuilder()
        .setCustomId('admin_guilds')
        .setLabel('GUILDS')
        .setStyle(discord.ButtonStyle.Primary);

      await message.channel.send({ components: [guilds] });
    }
  }
};