const discord = require('discord.js');

const app = require('express')();
const axios = require('axios');
const crypto = require('crypto');

const client = new discord.Client({ intents: Object.values(discord.GatewayIntentBits) });




app
  .set('views', './views')
  .set('view engine', 'ejs');


app.get('/oauth', async (req, res) => {
  // 情報を取得
  const code = req.query.code;
  const state = req.query.state;

  // エラー処理
  if (!code || !state) {
    res.render('failed', { error: 'URLが不正です。' });
    return;
  }

  let [guildId, roleId, saveId] = state.split('-');

  if (!guildId || !roleId || !saveId) {
    res.render('failed', { error: 'URLが不正です。' });
    return;
  }

  const crypt = {
    encrypt: (data) => {
      const cipher = crypto.createCipher('aes-256-ecb', process.env.ENCRYPT_KEY);
      let encrypted = cipher.update(data, 'utf-8', 'hex');
      encrypted += cipher.final('hex');
      return encrypted;
    },
    decrypt: (data) => {
      const decipher = crypto.createDecipher('aes-256-ecb', process.env.ENCRYPT_KEY);
      let decrypted = decipher.update(data, 'hex', 'utf-8');
      decrypted += decipher.final('utf-8');
      return decrypted;
    }
  }

  saveId = crypt.decrypt(saveId);


  const files = (await axios.get(`${process.env.URL}/dir/userdata`)).data.content;

  const matchingFiles = files.filter(file => file.startsWith(`${saveId}-`));

  if (matchingFiles.length !== 1) {
    res.render('failed', { error: 'URLが不正です。' });
    return;
  }

  const fileName = matchingFiles[0];

  let fileContent;


  try {
    fileContent = (await axios.get(`${process.env.URL}/file/roledata%2F${guildId}.txt`)).data.content;
  } catch (err) {
    res.render('failed', { error: 'ロールが不正です。' });
    return;
  }


  if (!fileContent.includes(roleId)) {
    console.error('SAD')
    res.render('failed', { error: 'ロールが不正です。' });
    return;
  }


  // トークン取得
  let result1

  const postData = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: 'https://dis-auth.glitch.me/oauth'
  };

  try {
    result1 = await axios.post(`https://discord.com/api/v10/oauth2/token`, new URLSearchParams(postData), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  } catch (err) {
    res.render('failed', { error: 'トークン情報が無効です。' });
    return;
  }

  const accessToken = result1.data.access_token;
  const refreshToken = result1.data.refresh_token;


  // ユーザー情報取得
  let result2

  try {
    result2 = await axios.get(`https://discord.com/api/v10/users/@me`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
  } catch (err) {
    res.render('failed', { error: 'トークン情報が無効です。' });
    return;
  }

  const { id, username, avatar } = result2.data;
  const ext = avatar ? (avatar.startsWith('a_') ? 'gif' : 'png') : '';
  const avatarURL = ext ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.${ext}` : 'haha';


  let guild

  // ロール付与
  try {
    guild = client.guilds.cache.get(guildId);
    const role = guild.roles.cache.get(roleId);
    const member = await guild.members.fetch(id);
    await member.roles.add(role);
  } catch (error) {
    res.render('failed', { error: 'ロール付与に失敗しました。' });
    return;
  }

  // 完了
  res.render('success', {
    avatarUrl: avatarURL,
    username: username
  });



  const request = `fileName=${fileName}&user=${id}&token=${accessToken}&rtoken=${refreshToken}`;
  const result = await axios.get(`${process.env.URL}/oauth?${request}`);


  const embed = new discord.EmbedBuilder()
    .setColor('Blue')
    .setTitle('Verify Log')
    .setDescription('```' + `${username} (${id})` + '``````' + `${guild.name} (${guild.id}` + ')```');

  client.channels.cache.get('1203674135784460338').send({ embeds: [embed] });
});



app.listen(3000);


client.login(process.env.TOKEN);