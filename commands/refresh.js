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
      jsonData = await fs.readFile(`./userdata/${saveId}-${crypt.encrypt(password)}.json`, 'utf-8');
    } catch (err) {
      await interaction.reply({ content: 'IDまたはパスワードが間違っています。', ephemeral: true });
      return;
    }

  }
};