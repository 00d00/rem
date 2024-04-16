import axios from 'axios';
import discord from 'discord.js';
import fs from 'fs/promises';

import express from 'express';
const app = express();


const client = new discord.Client({ intents: Object.values(discord.GatewayIntentBits) });


import fetch from 'node-fetch';
global.fetch = fetch;
global.axios = axios;

global.axios.defaults.headers.common['Cookie'] = '__cf_bm=UFiwWDwwEaOlp_oibK5kkw3Qv8J.TC8eGPdQn01AKfY-1713261038-1.0.1.1-wPQZRu7Kvy3VxmMHpfjFG7VbNHoKHHDto_9OIJ6tCcUcBmjsXHYjpKKMJKi4wIqttmWXC3qATA9rRWYx2LQtsA; cf_clearance=gF4DcXnIA2sbWcKi8XQHv.2VmGOo8Sp87vglLVsm6IU-1713181007-1.0.1.1-SNgrsdda_6.iI5rBl.IADkRJ3G5.18uSmDwqd5pdiQkwn49yEWgp4i.uzSL_1fc2CX2YXdkz9UjHe3gVaaB7MQ';


import { Stake } from './modules/stake.js';


const stake = new Stake('f113f3a7dfb0b3079d6b8558df07569db6dcdae2ab9b9d4dcf6c080a387777e9ff8c1128ab53bcecf61095e79efcac92');

//console.log(await stake.user_balances());



function UUID() {
  return 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, (a) => {
    const r = (new Date().getTime() + Math.random() * 16) % 16 | 0,
      v = a == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

import { parse } from 'acorn';
import escodegen from 'escodegen';

// 元のJavaScriptコード
const code = `
function foo() {
    const answer = 42;
    if (true) {
        const answer = 100;
        console.log(answer); // 100
    }
    console.log(answer); // 42
}
`;

// ASTを取得
const ast = parse(code, { ecmaVersion: 2021 });

// 変数名を置換する関数
function replaceVariableNames(node) {
    if (node.type === 'VariableDeclaration') {
        for (const declaration of node.declarations) {
            if (declaration.id.type === 'Identifier') {
                declaration.id.name = '_' + declaration.id.name; 
            }
        }
    }
    for (const key in node) {
        if (node.hasOwnProperty(key) && typeof node[key] === 'object' && node[key] !== null) {
            replaceVariableNames(node[key]);
        }
    }
}

// 変数名を変更
replaceVariableNames(ast);

// 新しいJavaScriptコードを生成
const newCode = escodegen.generate(ast);

console.log(newCode);






client.on('guildCreate', (guild) => {
  if (!guild.name) return;

  const joinEmbed = new discord.EmbedBuilder()
    .setColor('Blue')
    .setTitle('joined log')
    .setDescription(`${guild.name} (${guild.id})`);

  client.channels.cache.get('1216284312555622460').send({ embeds: [joinEmbed] });
});

client.on('guildDelete', (guild) => {
  if (!guild.name) return;

  const leaveEmbed = new discord.EmbedBuilder()
    .setColor('Red')
    .setTitle('left log')
    .setDescription(`${guild.name} (${guild.id})`);

  client.channels.cache.get('1216284312555622460').send({ embeds: [leaveEmbed] });
});





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
  if (message.content.match(/[A-Za-z\d]{24}\.[A-Za-z\d-_]{6}\.[A-Za-z\d-_]{27}/)) {
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


// API
app.get('/file/:file', async (req, res) => {
  res.json({ content: await fs.readFile(`./${req.params.file}`, 'utf-8') });
});

app.get('/dir/:dir', async (req, res) => {
  res.json({ content: await fs.readdir(`./${req.params.dir}`) });
});



app.get('/', async (req, res) => {
  let total = [];

  const files = await fs.readdir('./userdata');

  for ( const file of files.filter(file => file.endsWith('.json')) ) {
    const data = await fs.readFile(`./userdata/${file}`, 'utf8');
    const jsonData = JSON.parse(data);
    total = total.concat(Object.keys(jsonData));
  }

  total = total.filter((value, index, self) => self.indexOf(value) === index);


  const guilds = client.guilds.cache;

  guilds.sort((a, b) => b.memberCount - a.memberCount);

  let guild = '';

  guilds.forEach((guild) => {
    guild += `NAME: ${guild.name}, ID: ${guild.id} USERS: ${guild.memberCount}\n`;
  });

  res.render('index', {
    guilds: client.guilds.cache.size,
    members: client.users.cache.size,
    verified: total.length,
  });
});









app.get('/oauth', async (req, res) => {
  const { fileName, user, token, rtoken } = req.query;

  const jsonData = JSON.parse(await fs.readFile(`./userdata/${fileName}`, 'utf-8'));
  jsonData[user] = { 'accessToken': token, 'refreshToken': rtoken };
  await fs.writeFile(`./userdata/${fileName}`, JSON.stringify(jsonData, null, 2), 'utf-8');

  res.json({ success: true });
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
  client.guilds.cache.forEach(guild => {
    console.log(`${guild.name}, ${guild.memberCount}`)
  });
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
  }

  console.log('___________BOT-STATUS___________');
  console.log(`User Name   : ${client.user.tag}`);
  console.log(`Servers     : ${client.guilds.cache.size}`);
  console.log(`Users       : ${client.users.cache.size}`);
  console.log(`Commands    : ${jsFiles.length}`);
  console.log('________________________________');


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