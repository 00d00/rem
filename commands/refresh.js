import discord from 'discord.js';
import { promises as fs } from 'fs';
import crypto from 'crypto';

import crypt from '../modules/crypt.js';

export default {
  data: new discord.SlashCommandBuilder()
    .setName('refresh')
    .setDescription('認証者を再取得')
    .addStringOption((option) => option
      .setName("パスワード")
      .setDescription('パスワードを入力')
      .setRequired(true)
    )
    .addIntegerOption((option) => option
      .setName("登録id")
      .setDescription('IDを指定')
      .setRequired(true)
    )
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator)
  ,
  async execute(interaction) {
    let saveId = interaction.options.getInteger('登録id');
    const password = interaction.options.getString('パスワード');

    saveId = saveId.toString();

    let jsonData

    try {
      jsonData = JSON.parse(await fs.readFile(`./userdata/${saveId}-${crypt.encrypt(password)}.json`, 'utf-8'));
    } catch (error) {
      await interaction.reply({ content: 'IDまたはパスワードが間違っています。', ephemeral: true });
      return;
    }

    await interaction.reply({ content: '再取得中...', ephemeral: true });

    for (const key in jsonData) {
      const token = jsonData[key];

      let result = {
        code201: 0,
        code204: 0,
        code403: 0, // 
        code429: 0, // Too Many Request
      };
    }
  }
};