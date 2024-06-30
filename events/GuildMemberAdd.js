import discord from 'discord.js';

export default {
  name: discord.Events.GuildMemberAdd,
  async execute(client, member) {
    if (member.guild.id === '') { //shop
    }

    const channel = member.guild.channels.cache.get('1097793408153702430');
    if (!channel) return;

    const embed = new discord.EmbedBuilder()
      .setColor('Green')
      .setTitle('参加通知')
      .setDescription(`<@${member.id}> さんが参加しました。`)
      .setThumbnail(member.user.displayAvatarURL())
      .setFooter({ text: `サーバー人数: ${member.guild.memberCount}` })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  }
}