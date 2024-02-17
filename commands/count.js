import discord from 'discord.js';
import fs from 'fs/promises';
import crypto from 'crypto';
import crypt from '../modules/crypt.js';

export default {
  data: new discord.SlashCommandBuilder()
    .setName('count')
    .setDescription('認証済みの人数を取得')
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
    // 引数取得
    let saveId = interaction.options.getInteger('登録id');
    const password = interaction.options.getString('パスワード');

    let file;

    try {
      file = await fs.readFile(`./userdata/${saveId}-${crypt.encrypt(password)}.json`, 'utf-8');
    } catch(err) {
      interaction.reply({ content: 'IDまたはパスワードが間違っています。', ephemeral: true });
      return;
    }

    const num = Object.keys(JSON.parse(file)).length;

    await interaction.reply({ content: `\`\`\`Verified: ${num}\`\`\``, ephemeral: true });
  }
}