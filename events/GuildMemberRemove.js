import discord from 'discord.js';

export default {
  name: discord.Events.GuildMemberRemove,
  async execute(client, member) {
    const channel = member.guild.channels.cache.get('1097793408153702430');
    if (!channel) return;

    const embed = new discord.EmbedBuilder()
      .setColor('Red')
      .setTitle('離脱通知')
      .setDescription(`<@${member.id}> さんが離脱しました。`)
      .setThumbnail(member.user.displayAvatarURL())
      .setFooter({ text: `サーバー人数: ${member.guild.memberCount}` })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  }
}