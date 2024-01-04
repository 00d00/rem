const discord = require('discord.js');

module.exports = {
  name: discord.Events.GuildDelete,
  async execute(client, guild) {
    const embed = new discord.EmbedBuilder()
      .setColor(process.env.COLOR)
      .setTitle('Left Server')
      .setDescription('```' + `${guild.name} (${guild.id})` + '```')
    
    client.channels.cache.get('1192356340006395974').send({ embeds: [embed] });
  }
};