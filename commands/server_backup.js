import discord from 'discord.js';
import fs from 'fs/promises';

export default {
  data: new discord.SlashCommandBuilder()
    .setName('server-backup')
    .setDescription('サーバーテンプレートを作成')
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator)
  ,
  async execute(interaction) {
    const template = await interaction.guild.createTemplate('Backup');

    const embed = new discord.EmbedBuilder()
      .setTitle('server-backup')
      .setDescription(template.url);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};