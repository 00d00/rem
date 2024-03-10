import axios from 'axios';
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
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }


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
      // token情報は jsonData[key]

      let result = {
        code201: 0, // 成功
        code204: 0, // 参加済み
        code400: 0, // 参加上限
        code403: 0, // データ失効済み
        unknown: 0
      };

      const postData = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: jsonData[key].refreshToken,
        redirect_uri: 'https://dis-auth.glitch.me/oauth'
      };


      try {
        const response = await axios.post('https://discord.com/api/v10/oauth2/token', new URLSearchParams(postData), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        jsonData[key].accessToken = response.data.access_token;
        jsonData[key].refreshToken = response.data.refresh_token;

        const request = await axios.post(`https://discord.com/api/guilds/${interaction.guild.id}/members/${key}`, {
          headers: {
            Authorization: `Bot ${process.env.CLIENT_TOKEN}`,
            'Content-Type': 'application/json'
          },
          validateStatus: () => true
        });

        switch (request.status) {
          case 201:
            result.code201 ++;
            break;
  
          case 204:
            result.code204 ++;
            break;

          case 400:
            result.code400 ++;
            break;

          case 403:
            result.code403 ++;
            delete jsonData[key];
            break;

          default:
            result.unknown ++;
            break;
        }
      } catch (error) { // データ失効済みの処理
        result.code403 ++;
        delete jsonData[key];
      }
    } // for.in
  }
};