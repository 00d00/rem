import discord from 'discord.js';

export default {
  name: discord.Events.InteractionCreate,
  async execute(client, interaction) {
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith("verify_")) return;

    const member = interaction.guild.members.cache.get(interaction.user.id);

    await member.roles.add(interaction.customId.slice(7));

    const embed = new discord.EmbedBuilder()
      .setTitle('認証完了')
      .setDescription(`<@${interaction.user.id}> さんの認証が完了しました。`)
      .setColor("Green")

    await interaction.reply({ embeds: [embed], ephemeral: true });

    if (interaction.guild.id === '1191184738988339261') {
      const channel = interaction.guild.channels.cache.get('1240244950235615232');

      const log = new discord.EmbedBuilder()
        .setColor('Green')
        .setTitle('参加通知')
        .setDescription(`<@${member.id}> さんが参加しました。`)
        .setThumbnail(member.user.displayAvatarURL())
        .setFooter({ text: `サーバー人数: ${member.guild.memberCount}` })
        .setTimestamp();

      await channel.send({ embeds: [log] });
    }
  }
};