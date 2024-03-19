import discord from 'discord.js';

const obj = {};

import verify from './verify.js';
verify.type = 1;
obj.verify = verify


const data = new discord.SlashCommandBuilder()
  .setName('backup')
  .setDescription('backup')

data.options.push(verify);



export default {
  data: data,
  async execute(interaction) {
    const command = interaction.options.getSubcommand();

    verify.execute(interaction);
  }
}