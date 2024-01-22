const discord = require('discord.js');

module.exports = {
  name: discord.Events.InteractionCreate,
  async execute(interaction) {

    if (interaction.customId === 'admin_guilds') {
      const res = '';
      let index = 1;

      client.guilds.cache.forEach(async (guild) => {
        res += `[${index}] NAME: ${guild.name}, ID: ${guild.id}, OWNER: <@${guild.ownerId}>(${guild.ownerId})\n`;
        index ++;
      });

      await interaction.reply(`\`\`\`${res}\`\`\``);
    }

  }
};