const discord = require('discord.js');
const fs = require('fs');
module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName('setrole')
    .setDescription('認証時に付与するロールを設定')
    .addRoleOption((option) => option
      .setName("ロール")
      .setDescription('ロールを選択')
      .setRequired(true)
    )
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator)
  ,
  async execute(interaction) {
    const filePath = `./serverdata/${interaction.guild.id}/role.txt`;
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      console.log('ファイルの内容:', data);
    } catch (error) {
      fs.writeFileSync(filePath, '', 'utf-8');
      console.log('新しいファイルを作成しました。内容:', '');
    }
    await interaction.reply('a');
  }
}