import discord from 'discord.js';

export default {
  name: discord.Events.ClientReady,
  async execute(client, readiedClient) {
    const guildsCount = client.guilds.cache.size;
    const membersCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
    
    client.user.setActivity(`**${guildsCount}**Servers, **${membersCount}**Members`, { type: discord.ActivityType.Custom });
  }
}