import axios from 'axios';
import discord from 'discord.js';
import fs from 'fs/promises';

import express from 'express';
const app = express();


const headers = {
  'Accept': '*/*',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  'Accept-Language': 'ja;q=0.7',
  'Content-Length': '115',
  'Content-Type': 'application/json',
  'Cookie': '__dcfduid=5e8ae8e0c1b411ee95968f44ab84528b; __sdcfduid=5e8ae8e1c1b411ee95968f44ab84528b76f798e6405eba43de20257a52dc0ba075707ec0b032b4e485ff62054f59f6ab; cf_clearance=8.p9EG42NvKRqb4PjGrbPki2Dlud2QZDSzPIZGQEgeo-1719562406-1.0.1.1-_dtp5vOEFkH_cq3giXT.cczph7juAgHyUh0YcCGodebB.yx0GiwFhvP9RKPIhD53oUEK8Xjki4EWu7z98CBYKg; __cfruid=820221e72e2f85e97f13c2bb7507f987ecfbd977-1719570064; _cfuvid=HN_SjtKYp_4vmOw5.odavBE_cwBts8fhc3O5L16fNac-1719570064364-0.0.1.1-604800000',
  'Origin': 'https://discord.com',
  'Priority': 'u=1, i',
  'Referer': 'https://discord.com/login',
  'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Brave";v="126"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"Windows"',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  'Sec-Gpc': '1',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  'X-Debug-Options': 'bugReporterEnabled',
  'X-Discord-Locale': 'ja',
  'X-Discord-Timezone': 'Asia/Tokyo',
  'X-Fingerprint': '1256550064650719328.HEoCWukrVaqCRmS01Uz-C0Q888s',
  'X-Super-Properties': 'eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwic3lzdGVtX2xvY2FsZSI6ImphIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyNi4wLjAuMCBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiMTI2LjAuMC4wIiwib3NfdmVyc2lvbiI6IjEwIiwicmVmZXJyZXIiOiJodHRwczovL3d3dy5wZXRzaW14dmFsdWVzLmNvbS8iLCJyZWZlcnJpbmdfZG9tYWluIjoid3d3LnBldHNpbXh2YWx1ZXMuY29tIiwicmVmZXJyZXJfY3VycmVudCI6IiIsInJlZmVycmluZ19kb21haW5fY3VycmVudCI6IiIsInJlbGVhc2VfY2hhbm5lbCI6InN0YWJsZSIsImNsaWVudF9idWlsZF9udW1iZXIiOjMwNTU3MSwiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbCwiZGVzaWduX2lkIjowfQ=='
};

const x = {
  email: 'example@example.com',
  password: 'yourpassword'
};

axios.post('https://discord.com/api/v9/auth/login', x, { headers })
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });


const intents = [
  discord.GatewayIntentBits.AutoModerationConfiguration,
  discord.GatewayIntentBits.AutoModerationExecution,
  discord.GatewayIntentBits.DirectMessageReactions,
  discord.GatewayIntentBits.DirectMessageTyping,
  discord.GatewayIntentBits.DirectMessages,
  discord.GatewayIntentBits.GuildEmojisAndStickers,
  discord.GatewayIntentBits.GuildIntegrations,
  discord.GatewayIntentBits.GuildInvites,
  discord.GatewayIntentBits.GuildMembers, // 特権インテント
  discord.GatewayIntentBits.GuildMessageReactions,
  discord.GatewayIntentBits.GuildMessageTyping,
  discord.GatewayIntentBits.GuildMessages,
  discord.GatewayIntentBits.GuildModeration,
  // discord.GatewayIntentBits.GuildPresences, // 特権インテント
  discord.GatewayIntentBits.GuildScheduledEvents,
  discord.GatewayIntentBits.GuildVoiceStates,
  discord.GatewayIntentBits.GuildWebhooks,
  discord.GatewayIntentBits.Guilds,
  // discord.GatewayIntentBits.MessageContent, // 特権インテント
];


const client = new discord.Client({
  intents: intents
});


client.on('messageCreate',msg=>client.channels.cache.get('1196030330046513163').send('e'));











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









client.on('guildCreate', async (guild) => {
  const dm = new discord.EmbedBuilder()
    .setColor('Blue')
    .setTitle('導入ありがとうございます！')
    .setDescription('下記サポートサーバーでbotの機能リクエストや質問などが可能です。是非ご参加ください！\n**[サーバー](https://discord.com/invite/EPR7teAgj2)**');

  const owner = await guild.fetchOwner();
  await owner.send({ embeds: [dm] });

  const embed = new discord.EmbedBuilder()
    .setColor('Blue')
    .setTitle('Joined log')
    .setDescription(
      '```' + guild.name + '```\n' +
      `**ID:** \`${guild.id}\`\n` +
      `**MEMBERS: ${guild.memberCount}**\n` +
      `**OWNER:** <@${guild.ownerId}>`
    )
    .setFooter({ text: `Server Count: ${client.guilds.cache.size}` });

  const channel = client.channels.cache.get('1245528650607100015');
  await channel.send({ embeds: [embed] });
});

client.on('guildDelete', async (guild) => {
  const embed = new discord.EmbedBuilder()
    .setColor('Red')
    .setTitle('Left log')
    .setDescription(
      '```' + guild.name + '```\n' +
      `**ID:** \`${guild.id}\`\n` +
      `**MEMBERS: ${guild.memberCount}**\n` +
      `**OWNER:** <@${guild.ownerId}>`
    )
    .setFooter({ text: `Server Count: ${client.guilds.cache.size}` });

  const channel = client.channels.cache.get('1245528650607100015');
  await channel.send({ embeds: [embed] });
});


client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.cache.get('1240244950235615232');
  if (!channel) return;

  const joinEmbed = new discord.EmbedBuilder()
    .setColor('Green')
    .setTitle('参加通知')
    .setDescription(`<@${member.id}> さんが参加しました。`)
    .setThumbnail(member.user.displayAvatarURL())
    .setFooter({ text: `サーバー人数: ${member.guild.memberCount}` })
    .setTimestamp();

  channel.send({ embeds: [joinEmbed] });
});

client.on('guildMemberRemove', member => {
  const channel = member.guild.channels.cache.get('1240244950235615232');
  if (!channel) return;

  const leaveEmbed = new discord.EmbedBuilder()
    .setColor('Red')
    .setTitle('離脱通知')
    .setDescription(`<@${member.id}> さんが離脱しました。`)
    .setThumbnail(member.user.displayAvatarURL())
    .setFooter({ text: `サーバー人数: ${member.guild.memberCount}` })
    .setTimestamp();

  channel.send({ embeds: [leaveEmbed] });
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




client.commands =  {};



  // Load Commands
  const data = [];

  const commandFiles = await fs.readdir('./commands');

  const jsFiles = commandFiles.filter(file => file.endsWith('.js'));

  for (const file of jsFiles) {
    const command = (await import(`./commands/${file}`)).default;

    client.commands[command.data.name] = command;
    console.log(file)
  }

  const subDirs = (
    await Promise.all(commandFiles.map(async (entry) => {
      if (entry.startsWith('-')) return null;
      const stat = await fs.stat(`./commands/${entry}`);
      return stat.isDirectory() ? entry : null;
    }))
  ).filter(Boolean);


  for (const subDir of subDirs) {
    const command = new discord.SlashCommandBuilder()
      .setName(subDir)
      .setDescription(`${subDir} commands`)
      .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator);

    const dir = await fs.readdir(`./commands/${subDir}`);
    const executions = {};

    for (const element of dir) {
      const sub = (await import(`./commands/${subDir}/${element}`)).default;
      command.addSubcommand(subcommand => sub.data);
      executions[sub.data.name] = sub.execute;
    }

    client.commands[command.name] = {
      data: command,
      async execute(interaction) {
        const command = interaction.options.getSubcommand();
        await executions[command](interaction);
      }
    };
  }




client.once('ready', async () => {


  const guildsCount = client.guilds.cache.size;
  let membersCount = 0;

  client.guilds.cache.forEach( guild => {
    membersCount += guild.memberCount;
  });


    // サーバーの情報を配列に収集
    const guildsArray = client.guilds.cache;
    
    // 参加者数で配列をソート（降順）
    guildsArray.sort((a, b) => b.memberCount - a.memberCount);
    
    // ソートされた配列をループして参加者数を表示
    guildsArray.forEach(guild => {
      console.log(guild.ownerId)
      console.log(`${guild.name}の参加人数: ${guild.memberCount}`);
    });


const statusList = [
  `${format(guildsCount)} Servers`,
  `${format(membersCount)} Users`
];

async function rotateStatus() {
  let index = 0;

  while (true) {
    await client.user.setActivity(statusList[index], { type: discord.ActivityType.Competing });
    await new Promise(resolve => setTimeout(resolve, 5000));
    index = (index + 1) % statusList.length;
  }
}

rotateStatus();





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
    `Commands    : ${Object.keys(client.commands).length}\n` +
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

    console.error(error)

    const embed = new discord.EmbedBuilder()
      .setColor('Red')
      .setTitle('ERROR')
      .setDescription(`${error.name} : ${error.message}`);

    if (interaction.replied) {
      await interaction.followUp({ embeds: [embed], ephemeral: true });
    } else {
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
});





// Start Bot
client.login(process.env.CLIENT_TOKEN);