import discord from 'discord.js';
import os from 'os';

export default {
  name: discord.Events.ClientReady,
  async execute(client, readiedClient) {
    const guildsCount = client.guilds.cache.size;
    const membersCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

    client.user.setActivity(`**${guildsCount}**Servers`, { type: discord.ActivityType.Watching });

  const statusChannel = client.channels.cache.get('1240125536223625318');


  statusChannel.send('```\n___________BOT-STATUS___________\n' +
    `User Name   : ${client.user.tag}\n` +
    `Servers     : ${client.guilds.cache.size}\n` +
    `Commands    : ${client.commands.length}\n` +
    `Mem Usage   : ${((1 - (os.freemem() / os.totalmem())) * 100).toFixed(2)}%` +
    '________________________________```');
  }
}