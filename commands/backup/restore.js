import discord from 'discord.js';
import fs from 'fs/promises';
import crypt from '../../modules/crypt.js';

export default {
  data: new discord.SlashCommandSubcommandBuilder()
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


    let result = {
      code201: 0, // 成功
      code204: 0, // 参加済み
      code400: 0, // 参加上限
      code403: 0, // データ失効済み
    };

    const keys = Object.keys(jsonData);

async function processKeys(keys) {
  for (let i = keys.length - 1; i >= 0; i--) {
    await sleep(1000);

    const key = keys[i];

    const postData = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: jsonData[key].refreshToken,
      redirect_uri: 'https://0x1.glitch.me/oauth'
    };

    try {
      const response = await axios.post('https://discord.com/api/v10/oauth2/token', new URLSearchParams(postData), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      jsonData[key].accessToken = response.data.access_token;
      jsonData[key].refreshToken = response.data.refresh_token;

      const request = await axios.put(`https://discord.com/api/guilds/${interaction.guild.id}/members/${key}`, { 'access_token': jsonData[key].accessToken }, {
        headers: {
          Authorization: `Bot ${process.env.CLIENT_TOKEN}`,
          'Content-Type': 'application/json'
        },
        validateStatus: () => true
      });

      switch (request.status) {
        case 201:
          result.code201++;
          break;

        case 204:
          result.code204++;
          break;

        case 400:
          result.code400++;
          break;

        case 403:
          result.code403++;
          delete jsonData[key];
          break;
      }
    } catch (error) { // データ失効済みの処理
      result.code403++;
      delete jsonData[key];
    }
  }
}

// keys を処理する関数を呼び出し、全ての処理が完了するのを待機する
await processKeys(keys);




    await fs.writeFile(`./userdata/${saveId}-${crypt.encrypt(password)}.json`, JSON.stringify(jsonData), 'utf8');

    const embed = new discord.EmbedBuilder()
      .setColor('Blue')
      .setTitle('復元結果')
      .addFields(
        { name: '成功', value: result.code201.toString() },
        { name: '参加済み', value: result.code204.toString() },
        { name: '参加上限', value: result.code400.toString() },
        { name: '失効済み', value: result.code403.toString() }
      );

    await interaction.followUp({ embeds: [embed] });

    const logEmbed = new discord.EmbedBuilder()
      .setColor(process.env.COLOR)
      .setTitle('Restore log')
      .setDescription(`<@${interaction.user.id}>` + '\n```' + `${interaction.guild.name} (${interaction.guild.id})` + '\n' + `${saveId} (${password})` + '```')
      .addFields(
        { name: '成功', value: result.code201.toString() },
        { name: '参加済み', value: result.code204.toString() },
        { name: '参加上限', value: result.code400.toString() },
        { name: '失効済み', value: result.code403.toString() }
      );

    await interaction.client.channels.cache.get('1216276310868103178').send({ embeds: [logEmbed] });
  }
};