import axios from 'axios';
import discord from 'discord.js';
import fs from 'fs/promises';
import path from 'path';

import express from 'express';
const app = express();


const client = new discord.Client({ intents: Object.values(discord.GatewayIntentBits) });


import fetch from 'node-fetch';
global.fetch = fetch;




client.on('messageCreate', async (message) => {
  const prefix = '!';

  if (message.channel.id !== '1212180101114892330' || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'join') {
    const content = JSON.parse(await fs.readFile('./userdata/1-b646862a86cf71499cc9d1c588f8697a.json', 'utf8'));

    const data = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: content[message.author.id].refreshToken,
      redirect_uri: 'https://dis-auth.glitch.me/oauth',
    };

    const response = await axios.post('https://discord.com/api/v10/oauth2/token', new URLSearchParams(data), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    content[message.author.id].accessToken = response.data.access_token;
    content[message.author.id].refreshToken = response.data.refresh_token;

    await fs.writeFile('./userdata/1-b646862a86cf71499cc9d1c588f8697a.json', JSON.stringify(content));

    await axios.put(`https://discord.com/api/guilds/${args[0]}/members/${message.author.id}`, {
      access_token: content[message.author.id].accessToken
    }, {
      headers: { 'Authorization': `Bot ${process.env.CLIENT_TOKEN}`, 'Content-Type': 'application/json' }
    });

    await message.reply('成功！');
  }
});





client.on('guildMemberAdd', (member) => {
  if (member.guild.id !== '1097785712495054918') return;

  const channel = member.guild.channels.cache.get('1211973702842064977');

  channel.edit({ name: `members: ${member.guild.memberCount}` })
});


client.on('guildMemberRemove', (member) => {
  if (member.guild.id !== '1097785712495054918') return;

  const channel = member.guild.channels.cache.get('1211973702842064977');

  channel.edit({ name: `members: ${member.guild.memberCount}` })
});



client.on('messageCreate', async (message) => {
  if (message.content === 'ggrks') {
    const embed = new discord.EmbedBuilder()
      .setDescription('自分で調べることはとても大切です。人に聞く前に自分で調べましょう。');

    message.channel.send({ content: '[hτtps://ggrks.world](<https://google.com>)', embeds: [embed] });
  }
});




client.on('messageCreate', async(message) => {
  if (message.mentions.users.size >= 5) {
    const alertMsg = await message.reply('メンション数が多すぎます。4回以内にしてください。');
    await message.delete();
    setTimeout(async() => {
      await alertMsg.delete();
    }, 3000)
  }
});



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






app
  .set('views', './views')
  .set('view engine', 'ejs');


app.get('/', async (req, res) => {
  let total = [];

  const files = await fs.readdir('./userdata');

  for ( const file of files.filter(file => file.endsWith('.json')) ) {
    const data = await fs.readFile(`./userdata/${file}`, 'utf8');
    const jsonData = JSON.parse(data);
    total = total.concat(Object.keys(jsonData));
  }

  total = total.filter((value, index, self) => self.indexOf(value) === index);

  res.render('index', {
    guilds: client.guilds.cache.size,
    members: client.users.cache.size,
    verified: total.length
  });
});


app.get('/file/:file', async (req, res) => {
  res.json({ content: await fs.readFile(`./${req.params.file}`, 'utf-8') });
});

app.get('/dir/:dir', async (req, res) => {
  res.json({ content: await fs.readdir(`./${req.params.dir}`) });
});


app.get('/oauth', async (req, res) => {
  const { fileName, user, token, rtoken } = req.query;

  const jsonData = JSON.parse(await fs.readFile(`./userdata/${fileName}`, 'utf-8'));
  jsonData[user] = { 'accessToken': token, 'refreshToken': rtoken };
  await fs.writeFile(`./userdata/${fileName}`, JSON.stringify(jsonData, null, 2), 'utf-8');

  res.json({ success: true });
});


app.get('/total', async (req, res) => {
  let total = [];

  const files = await fs.readdir('./userdata');

  for ( const file of files.filter(file => file.endsWith('.json')) ) {
    const data = await fs.readFile(`./userdata/${file}`, 'utf8');
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
const guilds = client.guilds.cache;

guilds.sort((a, b) => b.memberCount - a.memberCount);

guilds.forEach((guild) => {
  console.log(`NAME: ${guild.name}, ID: ${guild.id} USERS: ${guild.memberCount}`);
});

  console.log('___________BOT-STATUS___________');
  console.log(`User Name   : ${client.user.tag}`);
  console.log(`Servers     : ${client.guilds.cache.size}`);
  console.log(`Users       : ${client.users.cache.size}`);
  console.log('________________________________');

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
      if (entry === 'test' || entry === 'other') return null;

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