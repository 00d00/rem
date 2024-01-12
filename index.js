const axios = require('axios');
const fs = require('fs');
const fp = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const discord = require('discord.js');

const client = new discord.Client({
  intents: [
    discord.GatewayIntentBits.Guilds,
    discord.GatewayIntentBits.GuildMessages,
  ],
});



const app = require('express')();

app.set('views', './views');
app.set('view engine', 'ejs');




app.get('/total', async (req, res) => {
  let total = [];
  const dataDirectory = 'userdata/';

  try {
    const files = await fp.readdir(dataDirectory);

    for (const file of files) {
      const data = await fp.readFile(path.join(dataDirectory, file), 'utf8');
      const jsonData = JSON.parse(data);
      total = total.concat(Object.keys(jsonData.token));
    }

    total = total.filter((value, index, self) => self.indexOf(value) === index);

    res.render('total', { total: total.length, servers: client.guilds.cache.size });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});







app.get('/oauth', async (req, res) => {
  // 情報を取得
  const code = req.query.code;
  const state = req.query.state;

  // エラー処理
  if (!code || !state) {
    res.render('failed', { error: 'URLが不正です。' });
    return;
  }

  const [ guildId, roleId, saveId ] = state.split('-');

  if (!guildId || !roleId || !saveId) {
    res.render('failed', { error: 'URLが不正です。' });
    return;
  }

  let fileContent;

  try{
    fileContent = await fp.readFile(`./roledata/${guildId}.txt`, 'utf-8');
  } catch(err) {
    res.render('failed', { error: 'ロールが不正です。' });
    return;
  }
  
  fileContent = JSON.parse(fileContent);

  if (!fileContent.includes(roleId)) {
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
    redirect_uri: 'https://discord-auth-system.glitch.me/oauth'
  };

  try {
    result1 = await axios.post(`https://discord.com/api/v10/oauth2/token`, new URLSearchParams(postData), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  } catch(err) {
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
  } catch(err) {
    res.render('failed', { error: 'トークン情報が無効です。' });
    return;
  }

  const { id, username, avatar } = result2.data;
  const ext = avatar.startsWith('a_') ? 'gif' : 'png';
  const avatarURL = `https://cdn.discordapp.com/avatars/${id}/${avatar}.${ext}`;

  // データを保存
  let jsonData

  try {
    const data = await fp.readFile(`userdata/${saveId}.json`, 'utf-8');
    jsonData = JSON.parse(data);
  } catch(_err) {
    res.render('failed', { error: 'IDが不正です。' });
    return;
  }

  jsonData.token = jsonData.token || {};

  jsonData.token[id] = { 'accessToken': accessToken, 'refreshToken': refreshToken };

  await fp.writeFile(`userdata/${saveId}.json`, JSON.stringify(jsonData), 'utf-8');



  // ロール付与
  try {
    const guild = client.guilds.cache.get(guildId);
    const role = guild.roles.cache.get(roleId);
    const member = guild.members.cache.get(id);
    await member.roles.add(role);
  } catch (_err) {
    res.render('failed', { error: 'ロール付与に失敗しました。' });
    return;
  }


  // 完了
  res.render('success', {
    avatarUrl: avatarURL,
    username: username
  });
});




app.get('/dev/success', async (req, res) => {
  res.render('success', {
    avatarUrl: 'https://cdn.discordapp.com/avatars/1097780939368714310/06eb6e74c99569e4f32b4a0bbf23db79.png',
    username: 'i5_xyz'
  });
});

app.get('/dev/failed', async (req, res) => {
  res.render('failed', { error: 'テスト用のエラーページです。' });
});

app.listen(3000);




// コマンドデータの取得
const commands = new discord.Collection();


fs.readdirSync('commands')
  .filter(file => file.endsWith('.js'))
  .forEach(file => {
    const command = require(`./commands/${file}`);
    commands[command.data.name] = command;
  });


//コマンドを登録
client.once(discord.Events.ClientReady, async() => {
  const data = [];
  for (const commandName in commands) {
    data.push(commands[commandName].data)
  }
  await client.application.commands.set(data);
});


// コマンドを実行
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  try {
    await commands[interaction.commandName].execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: `\`\`\`${error}\`\`\``,
      ephemeral: true,
    })
  }
});




// イベントを登録
const events = fs.readdirSync('./events/').filter(file => file.endsWith('.js'));

for (const event of events) {
  const data = require(`./events/${event}`);
  if (data.once) {
    client.once(data.name, (...args) => data.execute(client, ...args));
  } else {
    client.on(data.name, (...args) => data.execute(client, ...args));
  }
}


client.login(process.env.CLIENT_TOKEN);