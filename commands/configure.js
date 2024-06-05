import discord from 'discord.js';
import fs from 'fs/promises';


export default {
  data: new discord.SlashCommandBuilder()
    .setName('configure')
    .setDescription('configure for admin')
  ,
  async execute(interaction) {
    const imageBuffer = await fs.readFile('./chart.png');
    await interaction.reply({
      files: [
        { attachment: imageBuffer, name: 'chart.png' }
      ]
    });
  }
};