const discord = require('discord.js');

module.exports = {
  name: discord.Events.GuildCreate,
  async execute(client, guild) {
    const embed = new discord.EmbedBuilder()
      .setColor(process.env.COLOR)
      .setTitle('Join Server')
      .setDescription('```' + `${guild.name} (${guild.id})` + '```')
    
    client.channels.cache.get('1192456061815373925').send({ embeds: [embed] });
  }
};