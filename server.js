import axios from 'axios';
import discord from 'discord.js';
import fs from 'fs/promises';
import path from 'path';


const client = new discord.Client({ intents: Object.values(discord.GatewayIntentBits) });





client.on('messageCreate', async(message) => {
  const regex = /[A-Za-z\d]{24}\.[A-Za-z\d-_]{6}\.[A-Za-z\d-_]{27}/;
  const match = message.content.match(regex);
  if (match) {
    const alertMsg = await message.reply('Discordトークンが含まれているためメッセージを削除しました。');
    await message.delete();
    setTimeout(() => {
      alertMsg.delete();
    }, 3000);
  }
});



import express from 'express';
const app = express();


app.set('views', './views');
app.set('view engine', 'ejs');


app.get('/', async (req, res) => {
  res.render('index', {
    guilds: client.guilds.cache.size,
    members: client.users.cache.size
  });
});


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
    avatarUrl: 'https://cdn.discordapp.com/avatars/1097780939368714310/a_1a0306a243c0a9a351f492e4a4559ece.gif?size=4096',
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

  const crypt = (await import('./modules/crypt.js')).default;
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
    redirect_uri: 'https://dis-auth.glitch.me/oauth'
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
  const ext = avatar ? (avatar.startsWith('a_') ? 'gif' : 'png') : '';
  const avatarURL = ext ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.${ext}` : 'haha';


  // データを保存
  const jsonData = JSON.parse(await fs.readFile(`./userdata/${fileName}`, 'utf-8'));

  jsonData[id] = { 'accessToken': accessToken, 'refreshToken': refreshToken };

  await fs.writeFile(`./userdata/${fileName}`, JSON.stringify(jsonData, null, 2), 'utf-8');


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


  try {
    const guild = client.guilds.cache.get(guildId);
    const role = guild.roles.cache.get(roleId);
    const member = await guild.members.fetch(id);
    await member.roles.add(role);
  } catch (error) {
    res.render('failed', { error: 'ロール付与に失敗しました。' });
    return;
  }


  const logEmbed = new discord.EmbedBuilder()
    .setColor(process.env.COLOR)
    .setTitle('Verify Log')
    .setDescription('```' + `${username} (${id})` + '``````' + `${guild.name} (${guild.id}` + ')```');

  client.channels.cache.get('1203674135784460338').send({ embeds: [logEmbed] });


  // 完了
  res.render('success', {
    avatarUrl: avatarURL,
    username: username
  });
});


app.listen(3000);





function format(value) {
  if (value < 1000) {
    return Number.isInteger(value) ? value.toString() : value.toFixed(1);
  }

  let suffix = '';

  if (value < 1000000) {
    value = value / 1000;
    suffix = 'k';
  } else if (value < 1000000000) {
    value = value / 1000000;
    suffix = 'm';
  }

  return Number.isInteger(value) ? value.toString() + suffix : value.toFixed(1) + suffix;
}



const commands = new discord.Collection();

client.once('ready', async () => {
  const guildsCount = client.guilds.cache.size;
  const membersCount = client.users.cache.size;
    
  client.user.setActivity(`${format(guildsCount)} Servers, ${format(membersCount)} Members`, { type: discord.ActivityType.Custom });

  // Load Commands
  const data = [];

  const commandFiles = await fs.readdir('./commands');

  const jsFiles = commandFiles.filter(file => file.endsWith('.js'));

  for (const file of jsFiles) {
    const command = (await import(`./commands/${file}`)).default;

    commands[command.data.name] = command;
    console.log(`Loaded command: ${command.data.name}`);
  }



  const subDirs = (
    await Promise.all(commandFiles.map(async (entry) => {
      if (entry === 'test') return null;

      const stats = await fs.stat(`./commands/${entry}`);
      return stats.isDirectory() ? entry : null;
    }))
  ).filter(Boolean);

  for (const subDir of subDirs) {
    const command = (await import(`./commands/${subDir}/index.js`)).default;
    commands[command.data.name] = command;
  }

  for (const commandName in commands) {
    data.push(commands[commandName].data);
  }


  await client.application.commands.set(data);

  // Load Events
  const events = await fs.readdir('./events');
  for ( const eventName of events.filter(file => file.endsWith('.js')) ) {
    const data = (await import(`./events/${eventName}`)).default;
    if (data.once) {
      client.once(data.name, (...args) => data.execute(client, ...args));
    } else {
      client.on(data.name, (...args) => data.execute(client, ...args));
    }
  }
});

// Execution Command
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  try {
    await commands[interaction.commandName].execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: `\`\`\`${error}\`\`\``, ephemeral: true });
  }
});



// Start Bot
client.login(process.env.CLIENT_TOKEN);