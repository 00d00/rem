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
      .setLabel('ユーザーID')
      .setStyle(discord.TextInputStyle.Short);

    const passwordInput = new discord.TextInputBuilder()
      .setCustomId('passwordInput')
      .setLabel('パスワード')
      .setStyle(discord.TextInputStyle.Short);

    modal.addComponents(firstActionRow, secondActionRow);

    await interaction.showModal(modal);
  }
}