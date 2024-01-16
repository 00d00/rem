const discord = require('discord.js');
const fs = require('fs').promises;
const crypto = require('crypto');

const crypt = require('../modules/crypt.js')

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName('verify')
    .setDescription('認証パネルを配置')
    .addIntegerOption((option) => option
      .setName("登録id")
      .setDescription('IDを指定')
      .setRequired(false)
    )
    .addStringOption((option) => option
      .setName("パスワード")
      .setDescription('パスワードを入力')
      .setRequired(true)
    )

    .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator)
  ,
  async execute(interaction) {
    // 引数取得
    let saveId = interaction.options.getInteger('登録id');
    const password = interaction.options.getString('パスワード');

    const encrypted = crypt.encrypt(password);

    let file

    try {
      file = await fs.readFile(`./userdata/${saveId}-${crypt.encrypt(saveId)}`, 'utf-8');
    } catch(err) {
      interaction.reply({ content: 'IDまたはパスワードが間違っています。', ephemeral: true });
      return;
    }

    const num = Object.keys(JSON.parse(file)).length;

    const embed = new discord.EmbedBuilder()
      .setColor(process.env.COLOR)
      .setTitle('Verify')
      .setDescription('```下記ボタンから認証してください　```');

    await interaction.reply({ content: `${num}` });
  }
}