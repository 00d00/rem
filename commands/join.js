const discord = require('discord.js');
const fs = require('fs').promises;
const crypto = require('crypto');

const axios = require('axios');

const crypt = require('../modules/crypt.js');

const wait = (ms) => new Promise( resolve => setTimeout(() => resolve(), ms) );

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName('join1')
    .setDescription('IDを指定して1人復元')
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
    .addStringOption(option => option
      .setName("ユーザーid")
      .setDescription('参加させるユーザーのID')
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
      unknown: []
    };

    // log 1
    const startEmbed = new discord.EmbedBuilder()
      .setColor(process.env.COLOR)
      .setTitle('Start Restore')
      .setDescription('```' + `${interaction.guild.name} (${interaction.guild.id})` + '```');

    interaction.client.channels.cache.get('1196750201738756136').send({ embeds: [startEmbed] });

    await interaction.reply({ content: `処理開始`, ephemeral: true});

    // 参加処理
    Object.keys(tokens).forEach(async (userId) => {
      const token = tokens[userId];

      const head = {
        'Authorization': `Bot ${process.env.CLIENT_TOKEN}`,
        'Content-Type': 'application/json'
      };

      const res = await axios.put(
        `https://discord.com/api/guilds/${interaction.guild.id}/members/${userId}`,
        { access_token: token.accessToken },
        {
          validateStatus: (status) => true,
          headers: head
        }
      );

      switch (res.status) {
        case 201:
          result.C201.push(userId);
          break;

        case 204:
          result.C204.push(userId);
          break;

        case 400:
          result.C400.push(userId);
          break;

        case 429:
          result.C429.push(userId);
          break;

        case 403:
          const newToken = await axios.post(
            'https://discord.com/api/v10/oauth2/token',
            {
              'client_id'     : process.env.CLIENT_ID,
              'client_secret' : process.env.CLIENT_SECRET,
              'grant_type'    : 'refresh_token',
              'refresh_token' : token.refreshToken
            }, {
              validateStatus: (status) => true,
              headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }
          );

          switch (newToken.status) {
            case 403:
              result.C403.push(userId);
              delete tokens[userId].accessToken;
              delete tokens[userId].refreshToken;
              break;

            case 201:
              tokens[userId].accessToken = newToken.access_token;
              tokens[userId].refreshToken = newToken.refresh_token;

              const res2 = await axios.put(
                `https://discord.com/api/guilds/${interaction.guild.id}/members/${userId}`,
                {
                  'client_id'     : process.env.CLIENT_ID,
                  'client_secret' : process.env.CLIENT_SECRET,
                  'grant_type'    : 'refresh_token',
                  'refresh_token' : token.refreshToken
                }, {
                  validateStatus: (status) => true,
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }
              );

              switch (res2.status) {
                case 201:
                  result.C201.push(userId);
                  break;

                case 204:
                  result.C204.push(userId);
                  break;

                case 400:
                  result.C400.push(userId);
                  break;

                case 403:
                  result.C429.push(userId);
                  break;

                case 429:
                  result.C429.push(userId);
                  break;
              }
              break;
          }
          break;
      }
      await wait(1000);
    });

    //await interaction.followUp({ embeds: [embed] });
    await interaction.followUp(JSON.stringify(result));

    // log 2
    const endEmbed = new discord.EmbedBuilder()
      .setColor(process.env.COLOR)
      .setTitle('End Restore')
      .setDescription('```' + `${interaction.guild.name} (${interaction.guild.id})` + '```');

    interaction.client.channels.cache.get('1196750201738756136').send({ embeds: [endEmbed] });
  }
}