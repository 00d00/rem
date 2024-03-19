import discord from 'discord.js';

const commands = {};


const data = new discord.SlashCommandBuilder()
  .setName('backup')
  .setDescription('backup')


import verify from './verify.js';
verify.type = 1;
commands.verify = verify
data.options.push(verify);






export default {
  data: data,
  async execute(interaction) {
    const command = interaction.options.getSubcommand();

    commands[command].execute(interaction);
  }
}