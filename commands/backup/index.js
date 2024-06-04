import discord from 'discord.js';


export default new discord.SlashCommandBuilder()
  .setName('backup')
  .setDescription('backup')
  .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator);