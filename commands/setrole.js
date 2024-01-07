const discord = require('discord.js');
const fs = require('fs');
module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName('setrole')
    .setDescription('認証時に付与するロールを設定、確認')
    .addRoleOption((option) => option
      .setName("ロール")
      .setDescription('ロールを選択')
      .setRequired(true)
    )
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator)
  ,
  async execute(interaction) {
    const role = interaction.options.getRole('ロール');

    fs.writeFileSync(`./serverdata/${interaction.guild.id}/role.txt`, '', 'utf-8');

    await interaction.reply('ロールを設定しました！');
  }
}