import discord from 'discord.js';


export default {
  data: new discord.SlashCommandBuilder()
    .setName('help')
    .setDescription('backupの使い方を表示')
  ,
  async execute(interaction) {
    const embed = new discord.EmbedBuilder()
      .setColor('Blue')
      .setTitle('Help');

    

    await interaction.reply({ embeds: [embed] });
  }
};