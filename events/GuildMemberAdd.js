import discord from 'discord.js';

export default {
  name: discord.Events.InteractionCreate,
  async execute(client, member) {
    const channel = member.guild.systemChannel; // 離脱通知用のチャネルを指定します
    if (!channel) return;

    const embed = new disocrd.EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle('LEAVE - 退出')
      .setDescription(`<@${member.id}> がサーバーから脱退しました。\n現在のメンバー数: ${member.guild.memberCount} 人`)
      .setFooter({ text: 'MADE BY TETTU0530' });

    await channel.send({ embeds: [embed] });
  }
}