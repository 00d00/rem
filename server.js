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
  '71875c5350bb34413b84e99b55ebeff3c69fe5c4a8b805b3f00ca6a997166b6964a84940839b39eb170004973a607d10',
  'currency_hideZeroBalances=false; fiat_number_format=en; cookie_consent=false; sidebarView=hidden; casinoSearch=["Monopoly","Crazy Time","Sweet Bonanza","Money Train","Reactoonz"]; sportsSearch=["Liverpool FC","Kansas City Chiefs","Los Angeles Lakers","FC Barcelona","FC Bayern Munich"]; sportMarketGroupMap={}; oddsFormat=decimal; intercom-device-id-cx1ywgf2=cd950a0b-2394-420c-811a-1a11e3988a83; currency_currency=ltc; session=dde6c95d0b08b7ef288a7ac4d329b7d887fc59c4102fffba9030100249c7de6fd8b566ed31c4b6ef865031b626250fcd; session_info={"id":"53c9c302-53a2-438a-8db0-2cd4b4dd154b","sessionName":"Chrome (Unknown)","ip":"106.167.232.160","country":"JP","city":"Shinjuku","active":true,"updatedAt":"Mon, 24 Jun 2024 05:15:31 GMT","__typename":"UserSession"}; fullscreen_preference=false; hideBalances=false; currency_currencyView=crypto; locale=ja; cf_clearance=Q4kW8NG0f8Ddt6d.bD3y8Gc9aLyd_CzS.fW5kwCi3iY-1719725578-1.0.1.1-OmstTXXmj8EvY08Wj4D1hH.t_qJNYeFWIY.aqiIqMYaorq0svXxSSqv9QIAaqy5UqnRTjSE7BO7KTY06PmpLhA; intercom-session-cx1ywgf2=Z0E5N2dSYTU5NjFEbHZLWHplUHpYdGZsTEY2b3E1eVVqN0JYNEFPOGhTRUlrcUdtcytrck4za0VOd1RlZGF1aS0tMDN2TmQ1L05WK3RNRHljSVdNSTU0Zz09--22278c3b7f91d266021d9ce340116e630614d9ff; __cf_bm=EQQJ2JdkUft1ywsdVoRQz0flxzu39mgyfkjkjNzbi60-1719733038-1.0.1.1-.IcZtqpnWnlOm7Vk4gf__ES8nqy94gVetBg_ACq__npNb2OIoWzuLJPJPFg53uXF8lU1A79Ov1bK_RhvK_73mg; leftSidebarView_v2=minimized; _dd_s=rum=0&expire=1719734757459'
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
  if (!guild.name) return;
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