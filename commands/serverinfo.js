import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('サーバーの情報を表示'),
  async execute(interaction) {
    const { guild } = interaction;

    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setTitle(`${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: 'サーバー名', value: `\`\`\`${guild.name}\`\`\``, inline: true },
        { name: 'サーバーID', value: `\`\`\`${guild.id}\`\`\``, inline: true },
        { name: 'オーナー', value: `<@${guild.ownerId}>`, inline: true },
        { name: 'メンバー数', value: `\`\`\`${guild.memberCount}\`\`\``, inline: true },
        { name: '作成日', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: true },
        { name: '地域', value: `\`\`\`${guild.preferredLocale}\`\`\``, inline: true },
        { name: 'ブーストレベル', value: `\`\`\`${guild.premiumTier}\`\`\``, inline: true },
        { name: 'ブースト数', value: `\`\`\`${guild.premiumSubscriptionCount || '0'}\`\`\``, inline: true },
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
