const discord = require('discord.js');
const fs = require('fs');
module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName('setrole')
    .setDescription('認証時に付与するロールを設定、確認')
    .addRoleOption((option) => option
      .setName("ロール")
      .setDescription('ロールを選択')
      .setRequired(false)
    )
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator)
  ,
  async execute(interaction) {
    const role = interaction.options.getRole('ロール');

    const filePath = `./serverdata/${interaction.guild.id}/role.txt`;
    let data

    try {
      data = fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      fs.writeFileSync(filePath, '', 'utf-8');
      data = '';
    }

    if (!data) {
      await interaction.reply('ロールが設定されていません');
      return;
    }

    await interaction.reply('源三');
  }
}