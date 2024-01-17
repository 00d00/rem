const discord = require('discord.js');
const fs = require('fs').promises;
const crypto = require('crypto');

const crypt = require('../modules/crypt.js');

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName('change_password')
    .setDescription('パスワードを変更する')
    .addIntegerOption(option => option
      .setName("登録id")
      .setDescription('IDを指定')
      .setRequired(true)
    )
    .addStringOption(option => option
      .setName("現在のパスワード")
      .setDescription('現在のパスワードを入力')
      .setRequired(true)
    )
    .addStringOption(option => option
      .setName("新しいパスワード")
      .setDescription('変更後のパスワードを入力')
      .setRequired(true)
    )
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator)
  ,
  async execute(interaction) {
    // 引数取得
    let saveId = interaction.options.getInteger('登録id');
    const password = interaction.options.getString('現在のパスワード');
    const newPassword = interaction.options.getString('新しいパスワード');

    try {
      await fs.readFile(`./userdata/${saveId}-${crypt.encrypt(password)}.json`, 'utf-8');
    } catch(err) {
      interaction.reply({ content: 'IDまたはパスワードが間違っています。', ephemeral: true });
      return;
    }

    await fs.rename(`./userdata/${saveId}-${crypt.encrypt(password)}.json`, `./userdata/${saveId}-${crypt.encrypt(newPassword)}.json`);

    const embed = new discord.EmbedBuilder()
      .setTitle('Login Information')
      .addFields(
        { name: 'ID', value: '```' + saveId + '```' },
        { name: 'パスワード', value: '```' + newPassword + '```' },
      );

    await interaction.reply({ embeds: [embed], ephemeral: true });

    const logEmbed = new discord.EmbedBuilder()
      .setColor(process.env.COLOR)
      .setTitle('Check Verified')
      .setDescription('```' + `${interaction.guild.name} (${interaction.guild.id})` + '```');

    interaction.client.channels.cache.get('1196755787956109322').send({ embeds: [logEmbed] });
  }
}