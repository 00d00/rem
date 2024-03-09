import discord from 'discord.js';
import { promises as fs } from 'fs';
import crypto from 'crypto';

import crypt from '../modules/crypt.js';

export default {
  data: new discord.SlashCommandBuilder()
    .setName('restore')
    .setDescription('認証者を復元')
    .addStringOption((option) => option
      .setName('パスワード')
      .setDescription('パスワードを入力')
      .setRequired(true)
    )
    .addIntegerOption((option) => option
      .setName('登録id')
      .setDescription('IDを指定')
      .setRequired(true)
    )
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator)
  ,
  async execute(interaction) {
    const saveId = interaction.options.getInteger('登録id').toString();
    const password = interaction.options.getString('パスワード');


    let jsonData

    try {
      jsonData = JSON.parse(await fs.readFile(`./userdata/${saveId}-${crypt.encrypt(password)}.json`, 'utf-8'));
    } catch (error) {
      await interaction.reply({ content: 'IDまたはパスワードが間違っています。', ephemeral: true });
      return;
    }

    await interaction.reply({ content: '認証者を復元します。', ephemeral: true });

    for (const key in jsonData) {
      const token = jsonData[key];

      let result = {
        code201: 0, // 成功
        code204: 0, // 参加済み
        code403: 0, // 
        code429: 0, // Too Many Request
      };
    }
  }
};