import discord from 'discord.js';

import verify from './verify.js';
verify.type = 1;



const data = new discord.SlashCommandBuilder()
  .setName('backup')
  .setDescription('backup')

data.options.push(verify);


export default {
  data: data
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator)
  ,
  async execute(interaction) {
  }
}