import discord from 'discord.js';

export default {
  data: new discord.SlashCommandBuilder()
    .setName('automod')
    .setDescription('セキュリティ設定')
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator)
  ,
  async execute(interaction) {
    const embed = new discord.EmbedBuilder()
      .setColor('Blue')
      .setTitle('Automod Settings')
      .addFields(
        { name: 'モデレーターログ', value: modChannel }
      );

    await interaction.reply({ embeds: [embed] });
  }
};