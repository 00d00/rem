const axios = require('axios');

const fsa = require('fs');
const fs = require('fs').promises;

const path = require('path');
const crypto = require('crypto');

const crypt = require('./modules/crypt.js')

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
  const dataDirectory = 'userdata';

  const files = await fs.readdir(dataDirectory);

  for ( const file of files.filter(file => file.endsWith('.json')) ) {
    const data = await fs.readFile(path.join(dataDirectory, file), 'utf8');
    const jsonData = JSON.parse(data);
    total = total.concat(Object.keys(jsonData));
  }

  total = total.filter((value, index, self) => self.indexOf(value) === index);

  res.render('total', { total: total.length, servers: client.guilds.cache.size });
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




app.get('/oauth', async (req, res) => {
  // 情報を取得
  const code = req.query.code;
  const state = req.query.state;

  // エラー処理
  if (!code || !state) {
    res.render('failed', { error: 'URLが不正です。' });
    return;
  }

  let [ guildId, roleId, saveId ] = state.split('-');

  if (!guildId || !roleId || !saveId) {
    res.render('failed', { error: 'URLが不正です。' });
    return;
  }

  const crypt = require('./modules/crypt.js');
  saveId = crypt.decrypt(saveId);

  const files = await fs.readdir('./userdata');

  const matchingFiles = files.filter(file => file.startsWith(`${saveId}-`));

  if (matchingFiles.length !== 1) {
    res.render('failed', { error: 'URLが不正です。' });
    return;
  }

  const fileName = matchingFiles[0];

  let fileContent;

  try {
    fileContent = await fs.readFile(`./roledata/${guildId}.txt`, 'utf-8');
  } catch(err) {
    res.render('failed', { error: 'ロールが不正です。' });
    return;
  }


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


  const jsonData = JSON.parse(await fs.readFile(`./userdata/${fileName}`, 'utf-8'));

  jsonData[id] = { 'accessToken': accessToken, 'refreshToken': refreshToken };

  await fs.writeFile(`./userdata/${fileName}`, JSON.stringify(jsonData, null, 2), 'utf-8');

  let guild

  // ロール付与
  try {
    guild = client.guilds.cache.get(guildId);
    const role = guild.roles.cache.get(roleId);
    console.log(guild.members.cache);
    const member = await guild.members.fetch(id);
    await member.roles.add(role);
  } catch (error) {
    console.error(error);
    res.render('failed', { error: 'ロール付与に失敗しました。' });
    return;
  }

  const logEmbed = new discord.EmbedBuilder()
    .setColor(process.env.COLOR)
    .setTitle('Verify Log')
    .setDescription('```' + `${username} (${id})` + '``````' + `${guild.name} (${guild.id}` + ')```');

  if (guildId === '1097785712495054918') {
    client.channels.cache.get('1196972925811695626').send({ embeds: [logEmbed] })
  } else {
    client.channels.cache.get('1196967086312923156').send({ embeds: [logEmbed] })
  }

  // 完了
  res.render('success', {
    avatarUrl: avatarURL,
    username: username
  });
});



app.listen(3000);




// コマンドデータの取得
const commands = new discord.Collection();


fsa.readdirSync('commands')
  .filter(file => file.endsWith('.js'))
  .forEach(file => {
    const command = require(`./commands/${file}`);
    commands[command.data.name] = command;
  });


//コマンドを登録
client.on(discord.Events.ClientReady, async() => {
  fsa.readdirSync('commands')
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
      const command = require(`./commands/${file}`);
      commands[command.data.name] = command;
    });
  const data = [];
  for (const commandName in commands) {
    data.push(commands[commandName].data)
  }
  await client.application.commands.set(data);
  console.log('登録!')
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
const events = fsa.readdirSync('./events/').filter(file => file.endsWith('.js'));

for (const event of events) {
  const data = require(`./events/${event}`);
  if (data.once) {
    client.once(data.name, (...args) => data.execute(client, ...args));
  } else {
    client.on(data.name, (...args) => data.execute(client, ...args));
  }
}


client.login(process.env.CLIENT_TOKEN);