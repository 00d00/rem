const discord = require('discord.js');
const fs = require('fs').promises;

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName('regist')
    .setDescription('ユーザー登録')
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator)
  ,
  async execute(interaction) {
    const modal = new discord.ModalBuilder()
      .setCustomId('regist')
      .setTitle('ユーザー登録');

    const idInput = new discord.TextInputBuilder()
      .setCustomId('idInput')

    const
    await interaction.reply({ embeds: [embed], components: [row] });
  }
}