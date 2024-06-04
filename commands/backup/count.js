import discord from 'discord.js';

import { promises as fs } from 'fs';
import crypto from 'crypto';

import crypt from '../../modules/crypt.js';

export default {
  data: new discord.SlashCommandSubcommandBuilder()
    .setName('count')
    .setDescription('認証者数を確認')
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
  ,
  async execute(interaction) {
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

    const embed = new discord.EmbedBuilder()
      .setColor('Blue')
      .setTitle('backup count')
      .setDescription(`Verified: ${num}`);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};