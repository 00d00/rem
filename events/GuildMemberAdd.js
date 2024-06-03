import discord from 'discord.js';

export default {
  name: discord.Events.GuildMemberAdd,
  async execute(client, member) {
    const channel = member.guild.channels.cache.get('1097793408153702430');
    if (!channel) return;

    const embed = new discord.EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle('JOIN LOG')
      .setDescription(`<@${member.id}> さんが参加しました。`)
      .setFooter({ text: `サーバー人数: ${member.guild.memberCount}人` });

    await channel.send({ embeds: [embed] });
  }
}