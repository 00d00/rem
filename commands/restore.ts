const discord = require('discord.js');
const fs = require('fs').promises;
const crypto = require('crypto');

const axios = require('axios');

const crypt = require('../modules/crypt.js');

const wait = (ms) => return new Promise( resolve => setTimeout(() => resolve(), ms) );

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
    // 引数読み取り
    let saveId = interaction.options.getInteger('登録id');
    const password = interaction.options.getString('パスワード');

    // トークン読み取り
    let file

    try {
      file = await fs.readFile(`./userdata/${saveId}-${crypt.encrypt(password)}.json`, 'utf-8');
    } catch(err) {
      interaction.reply({ content: 'IDまたはパスワードが間違っています。', ephemeral: true });
      return;
    }

    if (token === '{}') {
      await interaction.reply({ content: 'まだ認証者がいません。', ephemeral: true });
      return;
    }

    const tokens = JSON.parse(file);

    const result = {
      C201: [], // 成功
      C204: [], // 参加済
      C400: [], // 参加上限
      C403: [], // トークン失効済
      C429: [], // リクエスト制限
    };

    // log 1
    const startEmbed = new discord.EmbedBuilder()
      .setColor(process.env.COLOR)
      .setTitle('Start Restore')
      .setDescription('```' + `${interaction.guild.name} (${interaction.guild.id})` + '```');

    interaction.client.channels.cache.get('1196750201738756136').send({ embeds: [startEmbed] });

    await interaction.reply({ content: `処理開始`, ephemeral: true});

    // 参加処理
    Object.keys(tokens).forEach(userId => {
      const API_ENDPOINT = process.env.END_POINT;
      const token = tokens[userId];
      try {
        const res = await axios.put(`https://discord.com/api/guilds/${interaction.guild.id}/members/${list[i]}`, {access_token: token}, {headers: head});

        // 2xxの処理
        switch (res.status) {
          case 201:
            result.C201.push(userId);
            break;

          case 204:
            result.C204 ++;
            break;
        }
      } catch(error) {
        switch (res.status) {
          case 400:
            result.C201 ++;
            break;

          case 403:
            result.C204 ++;
            break;

          case 429:
            break;
        }
      }
    });

    await interaction.followUp({ embeds: [embed] });

    // log 2
    const endEmbed = new discord.EmbedBuilder()
      .setColor(process.env.COLOR)
      .setTitle('End Restore')
      .setDescription('```' + `${interaction.guild.name} (${interaction.guild.id})` + '```');

    interaction.client.channels.cache.get('1196750201738756136').send({ embeds: [endEmbed] });
  }
}