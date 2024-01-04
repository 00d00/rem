const discord = require('discord.js');

module.exports = {
  name: discord.Events.GuildCreate,
  async execute(guild) {
    const embed = new discord.EmbedBuilder()
      .setColor(process.env.COLOR)
      .setTitle('Joined Server')
      .setDescription(`NAME: ${guild.name}` + '\n' + `ID: ${guild.id}`)
      .setThumbnail(guild.iconURL());
    guild.channels.cache.get('1192362617617002536').send({ embeds: [embed] });
  },
};