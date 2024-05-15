import axios from 'axios';
import discord from 'discord.js';
import fs from 'fs/promises';

import express from 'express';
const app = express();

const intents = [
  discord.GatewayIntentBits.Guilds
];

const client = new discord.Client({ intents: Object.values(discord.GatewayIntentBits) });


client.on('messageCreate', async (msg) => {
  const channel = client.channels.cache.get('1196030330046513163');
  if (!channel) return;

  await channel.send('A');
});


client.on('messageCreate', async message => {
  if (message.content === '!button') {
    const row = new discord.ActionRowBuilder()
      .addComponents(
        new discord.ButtonBuilder()
          .setCustomId('primary')
          .setLabel('Primary')
          .setStyle(discord.ButtonStyle.Primary),
      );

    const msg = await message.channel.send({ content: 'Press the button!', components: [row] });

    const collector = msg.createMessageComponentCollector({ time: 15000 });

    collector.on('collect', interaction => {
      console.log(`Collected ${interaction.customId} from ${interaction.user.tag}`);
    });

    collector.on('end', collected => {
      console.log(`Collected ${collected.size} interactions.`);
    });
  }
});


import os from 'os';

console.log('CPU使用率:', os.loadavg()[0].toFixed(2), '%');

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function displayDebugInfo() {
    console.log('---- System Information ----');
    console.log('Platform:', os.platform());
    console.log('Architecture:', os.arch());
    console.log('CPU Cores:', os.cpus().length);
    console.log('Total Memory:', formatBytes(os.totalmem()));
    console.log('Free Memory:', formatBytes(os.freemem()));
    console.log(`Memory Usage Rate: ${((1 - (os.freemem() / os.totalmem())) * 100).toFixed(2)}%`)
    console.log('---- Network Interfaces ----');
    // const networkInterfaces = os.networkInterfaces();
    // Object.keys(networkInterfaces).forEach(iface => {
    //     console.log(`Interface: ${iface}`);
    //     networkInterfaces[iface].forEach(addr => {
    //         console.log(`  Address: ${addr.address}`);
    //     });
    // });
}

// デバッグ情報を表示するコマンドを実行
displayDebugInfo();



import fetch from 'node-fetch';
global.fetch = fetch;
global.axios = axios;


/*
import { PayPay } from 'paypax';

const paypay = new PayPay('08012345678', 'Abcde256');
console.log(await paypay.login({token:'a'}));
console.log(await paypay.getBalance());
*/

import { Stake } from './modules/stake.js';


const stake = new Stake(
  '7234c6184d505a808a787d1c6f5dcbac04b344f2c1d8c2d8dc68a12de0523f12115826e480bb05975eaea8c20281c605',
  'currency_hideZeroBalances=false; currency_currencyView=crypto; fiat_number_format=en; cookie_consent=false; leftSidebarView_v2=expanded; sidebarView=hidden; casinoSearch=["Monopoly","Crazy Time","Sweet Bonanza","Money Train","Reactoonz"]; sportsSearch=["Liverpool FC","Kansas City Chiefs","Los Angeles Lakers","FC Barcelona","FC Bayern Munich"]; sportMarketGroupMap={}; oddsFormat=decimal; locale=en; intercom-id-cx1ywgf2=b7790e61-1f4f-4e23-9105-510657953e35; intercom-device-id-cx1ywgf2=27a9f89e-c4c1-4561-bb2c-9453c5cefc07; session=7234c6184d505a808a787d1c6f5dcbac04b344f2c1d8c2d8dc68a12de0523f12115826e480bb05975eaea8c20281c605; session_info={"id":"f6492d0a-d98b-43e2-be47-6bacd0054de1","sessionName":"Chrome (Unknown)","ip":"106.167.232.160","country":"JP","city":"Shinjuku","active":true,"updatedAt":"Wed, 01 May 2024 11:48:11 GMT","__typename":"UserSession"}; intercom-session-cx1ywgf2=UWVlTmVJd3hTb2RBZWNBbzRoZlhSUE1FcERBUmdmSHFqbjBCZVRIaENoVHk3M3BBVVRSeEtVa0FZcTNjZkR4SS0tY0ozTkxKWFZycnY1RzRENm1mMThnQT09--8cc658edb8d4aedd0e04d253a22afa4f249637d8; currency_currency=ltc; __cf_bm=1F4zlnxOSH3wOJ7UTCuF0lrtHHYeYWV.gG.L_b1su5g-1715039029-1.0.1.1-PUqbX3KPNoqqk4CKAspeb4qUwlNMQm5s2sv4CAoiNULMApZktgmRu7eW4sMCrexEh1KXoP6xqeZLkybQrxumew; _dd_s=rum=0&expire=1715040225970; cf_clearance=0VHt_ldyI9wMpne_0vGBqhVJhSuJYEIflUNoE3LP8FI-1715039348-1.0.1.1-R5cdoDefIBUA9U_9Us7qp6Ju6rmAyoP1RQpe0XW02D9BBAAfWb7x1C1urs7XU5_kjdmEqQeYoDWQV2jEkjsz2w'
);

//console.log(await stake.user_balances());

const webhook = new discord.WebhookClient({ url: 'https://discord.com/api/webhooks/1230465058694500423/9q4ioJWNL1JkWKM4a4UMS4yvEUlKKTUOAmUyhJ67lJWaSwpdKj8UGU6Q-ZnBB94E6lK8' });

client.on('messageCreate', async (message) => {
  if (message.webhookId) return;
  if (message.channel.id !== '1230464873364979783') return;

  const url = message.author.avatar
    ? message.author.displayAvatarURL()
    : 'https://cdn.discordapp.com/embed/avatars/0.png';

  await webhook.edit({
    name: message.author.tag,
    avatar: url
  });

  await message.delete();
  await webhook.send({ content: message.content, embeds: message.embed });
});




client.on('messageCreate', async message => {
  if (message.content === '!addRole') {
    const guild = message.guild;

    const targetRole = guild.roles.cache.get('1191720649631203369');
    if (!targetRole) return console.log('Invalid target role ID.');

    const roleToAdd = guild.roles.cache.get('1183060425298940014');
    if (!roleToAdd) return console.log('Invalid role to add ID.');

    const membersWithRole = targetRole.members;

    membersWithRole.forEach(member => {
      member.roles.add(roleToAdd)
        .then(() => {
          member.roles.remove('1191720649631203369');
          console.log(`Added role to ${member.user.tag}`)
        })
        .catch(console.error);
    });
  }
});



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



client.commands =  []

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

    client.commands[command.data.name] = command;
  }

  console.log('_________BOT-HAS-STARTED________');
  console.log(`User Name   : ${client.user.tag}`);
  console.log(`Servers     : ${client.guilds.cache.size}`);
  console.log(`Users       : ${client.users.cache.size}`);
  console.log(`Commands    : ${jsFiles.length}`);
  console.log('________________________________');


  const subDirs = (
    await Promise.all(commandFiles.map(async (entry) => {
      if (entry === 'test' || entry === 'paypay') return null;

      const stats = await fs.stat(`./commands/${entry}`);
      return stats.isDirectory() ? entry : null;
    }))
  ).filter(Boolean);

  for (const subDir of subDirs) {
    const command = (await import(`./commands/${subDir}/index.js`)).default;
    client.commands[command.data.name] = command;
  }

  for (const commandName in client.commands) {
    data.push(client.commands[commandName].data);
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

  const statusChannel = client.channels.cache.get('1240125536223625318');


  statusChannel.send(
    '```\n___________BOT-STATUS___________\n' +
    `User Name   : ${client.user.tag}\n` +
    `Servers     : ${client.guilds.cache.size}\n` +
    `Commands    : ${client.commands.length}\n` +
    `Mem Usage   : ${((1 - (os.freemem() / os.totalmem())) * 100).toFixed(2)}%\n` +
    '________________________________```'
  );

});

// Execution Command
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  try {
    await client.commands[interaction.commandName].execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: `\`\`\`${error}\`\`\``, ephemeral: true });
  }
});








// Start Bot
client.login(process.env.CLIENT_TOKEN);