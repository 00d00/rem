import discord from 'discord.js';

export default {
  name: discord.Events.GuildMemberAdd,
  async execute(client, member) {
    const channel = member.guild.xx;
    if (!channel) return;

    const embed = new discord.EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle('LEAVE LOG')
      .setDescription(`<@${member.id}> が退出しました。`)
      .setFooter({ text: `現在${member.guild.memberCount}人` });

    await channel.send({ embeds: [embed] });
  }
}