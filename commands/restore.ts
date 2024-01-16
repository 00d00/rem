const discord = require('discord.js');
const fs = require('fs').promises;
const crypto = require('crypto');

const axios = require('axios');

const crypt = require('../modules/crypt.js');

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName('restore')
    .setDescription('メンバーを復元')
    .addIntegerOption(option => option
      .setName("登録id")
      .setDescription('IDを指定')
      .setRequired(true)
    )
    .addStringOption(option => option
      .setName("パスワード")
      .setDescription('パスワードを入力')
      .setRequired(true)
    )
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator)
  ,
  async execute(interaction) {
    let saveId = interaction.options.getInteger('登録id');
    const password = interaction.options.getString('パスワード');

    // トークン読み取り
    let file

    try {
      file = await fs.readFile(`./userdata/${saveId}-${crypt.encrypt(password)}`, 'utf-8');
    } catch(err) {
      interaction.reply({ content: 'IDまたはパスワードが間違っています。', ephemeral: true });
      return;
    }

    const token = JSON.parse(file);

    if (token === {}) {
      await interaction.reply({ content: 'まだ認証者がいません。' });
      return;
    }

    const result = {
      C201: 0, // 成功
      C204: 0, // 参加済
      C400: 0, // 参加上限
      C403: 0, // トークン失効済
      C429: 0, // リクエスト制限
    };

    await interaction.reply({ content: `\`\`\`Verified: ${num}\`\`\``, ephemeral: true });

    const logEmbed = new discord.EmbedBuilder()
      .setColor(process.env.COLOR)
      .setTitle('Start Restore')
      .setDescription('```' + `${interaction.guild.name} (${interaction.guild.id})` + '```');

    interaction.client.channels.cache.get('1196750201738756136').send({ embeds: [logEmbed] });
  }
}