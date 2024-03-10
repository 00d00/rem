import discord from 'discord.js';


export default {
  data: new discord.SlashCommandBuilder()
    .setName('help')
    .setDescription('backupの使い方を表示')
  ,
  async execute(interaction) {
    
    interaction.reply();
  }
};