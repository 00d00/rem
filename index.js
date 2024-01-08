const axios = require('axios');
const fs = require('fs');
const fp = require('fs').promises;

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


app.get('/oauth', async (req, res) => {
  const code = req.query.code;
  const state = req.query.state;

  // 失敗時の処理
  if (!code || !state) {
    res.render('failed', { error: 'URLが不正です。' });
    return;
  }

  const [ guildId, roleId ] = state.split('-');

  if (!guildId || !roleId) {
    res.render('failed', { error: 'URLが不正です。' });
    return;
  }

  let fileContent;

  try{
    fileContent = await fp.readFile(`./serverdata/${guildId}/role.txt`, 'utf-8');
  } catch(err) {
    res.render('failed', { error: 'ロールが不正です。' });
    return;
  }

  if (roleId !== fileContent) {
    res.render('failed', { error: 'ロールが不正です。' });
  }

  // エラー処理終了

  const postData = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: 'https://discord-auth-system.glitch.me/oauth'
  };

  // トークン取得
  let result1
  try {
    result1 = await axios.post(`https://discord.com/api/v10/oauth2/token`, new URLSearchParams(postData), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  } catch(err) {
    res.render('failed', { error: 'トークン情報が無効です。' });
    return;
  }

  const access_token = result1.data.access_token;
  const refresh_token = result1.data.refresh_token;

  // ユーザー情報取得
  let result2
  try {
    result2 = await axios.get(`https://discord.com/api/v10/users/@me`, {
      headers: { 'Authorization': `Bearer ${access_token}` }
    });
  } catch(err) {
    res.render('failed', { error: 'トークン情報が無効です。' });
    return;
  }

  const userdata = result2.data;
  const { id, username, avatar } = userdata;
  const ext = avatar.startsWith('a_') ? 'gif' : 'png';
  const avatarURL = `https://cdn.discordapp.com/avatars/${id}/${avatar}.${ext}`;

  const filePath = ``;

  try {
    const data = await fp.readFile(filePath, 'utf8');
    console.log('ファイルの内容:', data);
  } catch (readError) {
    try {
      await fs.writeFile(filePath, 'Hello, world!');
    } catch (writeError) {
      console.error('ファイルの作成中にエラーが発生しました:', writeError);
    }
  }

  res.render('success', {
    avatarUrl: 'https://cdn.discordapp.com/avatars/1192454684494016583/92b7d39a1e8f7869e2e36049b595ce34.png',
    username: 'username'
  });
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