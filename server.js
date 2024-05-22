import axios from 'axios';
import discord from 'discord.js';
import fs from 'fs/promises';

import express from 'express';
const app = express();

const intents = [
  discord.GatewayIntentBits.AutoModerationConfiguration,
  discord.GatewayIntentBits.AutoModerationExecution,
  discord.GatewayIntentBits.DirectMessageReactions,
  discord.GatewayIntentBits.DirectMessageTyping,
  discord.GatewayIntentBits.DirectMessages,
  discord.GatewayIntentBits.GuildEmojisAndStickers,
  discord.GatewayIntentBits.GuildIntegrations,
  discord.GatewayIntentBits.GuildInvites,
  // discord.GatewayIntentBits.GuildMembers,
  discord.GatewayIntentBits.GuildMessageReactions,
  discord.GatewayIntentBits.GuildMessageTyping,
  discord.GatewayIntentBits.GuildMessages,
  discord.GatewayIntentBits.GuildModeration,
  // discord.GatewayIntentBits.GuildPresences,
  discord.GatewayIntentBits.GuildScheduledEvents,
  discord.GatewayIntentBits.GuildVoiceStates,
  discord.GatewayIntentBits.GuildWebhooks,
  discord.GatewayIntentBits.Guilds,
  // discord.GatewayIntentBits.MessageContent,
];


const client = new discord.Client({
  intents: intents
});


client.on('messageCreate', async (msg) => {
  const channel = client.channels.cache.get('1196030330046513163');
  if (!channel) return;

  await channel.send('A');
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


import { Stake } from './modules/stake.js';


const stake = new Stake(
  'cff88e9d1682a592b43cbff2ce9c092e743e0210c0c5932d686d7589efcfcc7c5a2d63a1728199d3343104a9942a42c4',
  'cf_clearance=0VHt_ldyI9wMpne_0vGBqhVJhSuJYEIflUNoE3LP8FI-1715039348-1.0.1.1-R5cdoDefIBUA9U_9Us7qp6Ju6rmAyoP1RQpe0XW02D9BBAAfWb7x1C1urs7XU5_kjdmEqQeYoDWQV2jEkjsz2w; __cf_bm=rfezPK6x2h2RNxlWBndgXT0eSvHRBJZz.jM2AFmYR_o-1716015872-1.0.1.1-VBy8E5FKpxXcXas6DXlEF197tc3oUM_tjMcsy8qttdl6ZfumThKvwB8dDTAjhFEoNrHHz0Ss1cKODC8IqO6APw; cf_clearance=IAcZMdIg5rNgLjCJ7xTAyFDSVfEs0ZLNItWHuCFETok-1716015873-1.0.1.1-6oYy8efZ3hN9h2_XWjLrBAurd0wJmw2iMilyxJGFL6Mr4prMl8_KMCI3nVnrB6eF3YKvFMbwtOCbMxbV4QSuQw; currency_currency=btc; currency_hideZeroBalances=false; currency_currencyView=crypto; session_info=undefined; fiat_number_format=en; cookie_consent=false; leftSidebarView_v2=expanded; sidebarView=hidden; casinoSearch=["Monopoly","Crazy Time","Sweet Bonanza","Money Train","Reactoonz"]; sportsSearch=["Liverpool FC","Kansas City Chiefs","Los Angeles Lakers","FC Barcelona","FC Bayern Munich"]; sportMarketGroupMap={}; oddsFormat=decimal; locale=ja; intercom-id-cx1ywgf2=e72ce864-af31-4fa7-a453-a05f9c343b99; intercom-session-cx1ywgf2=; intercom-device-id-cx1ywgf2=9236540e-3994-400b-8daa-58b6ab20868a'
);

//console.log(await stake.user_balances());









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





app.get('/check_account/:start', async (req, res) => {
    const start = parseInt(req.params.start);
    let i = start;
    const accounts = [];
    const charset = '_0123456789abcdefghijklmnopqrstuvwxyz'; // 使用する文字のセット

    function generateAccountName(index) {
        let name = '';
        let num = index;

        while (num >= charset.length) {
            name = charset[num % charset.length] + name;
            num = Math.floor(num / charset.length) - 1;
        }

        name = charset[num] + name;
        return name;
    }

    try {
        while (true) {
          //const accountName = generateAccountName(i);
            const response = await fetch(`https://fiicen.jp/signup/check_account_name/?account_name=${accountName}`);
            const data = await response.json();

            if (!data.is_taken) {
              accounts.push(accountName)
              console.log(accountName);
            }

            i++;
        }
      console.log(accounts)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
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
  const guildsCount = client.guilds.cache.size;
  const membersCount = client.users.cache.size;

  // client.user.setActivity(`${format(guildsCount)} Servers, ${format(membersCount)} Members`, { type: discord.ActivityType.Custom });
  client.user.setActivity(`${guildsCount} Servers`, { type: discord.ActivityType.Watching });
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
  }5

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




