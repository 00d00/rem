const discord = require('discord.js');

module.exports = {
  name: discord.Events.GuildCreate,
  async execute(guild) {
    const embed = new discord.EmbedBuilder()
      .setColor(process.env.COLOR)
      .setTitle('Joined Server')
      .setDescription('```\n' + `NAME: ${guild.name}` + '\n' + `ID: ${guild.id}` + '\n```')
      
    
    guild.client.channels.cache.get('1192356340006395974')
      .then( async (channel) => await channel.send({ embeds: [embed] }));
  },
};