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

    if (file === '{}') {
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
      let res
      const head1 = {
        'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json'
      };

      try {
        res = await axios.put(
          `https://discord.com/api/guilds/${interaction.guild.id}/members/${userId}`,
          { access_token: token.accessToken },
          { headers: head1 }
        );

        // 2xxの処理
        switch (res.status) {
          case 201:
            result.C201.push(userId);
            break;

          case 204:
            result.C204.push(userId);
            break;
        }
      } catch(error) {
        // 4xxの処理
        switch (res.status) {
          case 400:
            result.C400.push(userId);
            break;

          case 403:
            try {
              const res2 = await axios.post(
                'https://discord.com/api/v10/oauth2/token',
                {
                  'client_id'     : process.env.CLIENT_ID,
                  'client_secret' : process.env.CLIENT_SECRET,
                  'grant_type'    : 'refresh_token',
                  'refresh_token' : token.refreshToken,
                  'redirect_uri'  : 'https://discord-auth-system.glitch.me/oauth'
                }, { headers: {'Content-Type': 'application/x-www-form-urlencoded'} }
              );

              tokens[userId].accessToken = res2.access_token;
              tokens[userId].refreshToken = res2.refresh_token;

              const res3 = await axios.put(
                `https://discord.com/api/guilds/${interaction.guild.id}/members/${userId}`,
                { access_token: res2.access_token },
                { headers: head1 }
              );

            } catch(error) {
              result.C403.push(userId);
            }
            break;

          case 429:
            result.C429.push(userId);
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