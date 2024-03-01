import discord from 'discord.js';
import fs from 'fs/promises';


export default {
  data: new discord.SlashCommandBuilder()
    .setName('configure')
    .setDescription('configure for admin')
  ,
  async execute(interaction) {
    if (interaction.user.id !== '1097780939368714310') {
      await interaction.reply('Admin Only');
      return;
    }

    //await interaction.reply('実行中...');

    let data = {};

    for (const file of await fs.readdir('./userdata')) {
      const jsonData = JSON.parse(await fs.readFile(`./userdata/${file}`, 'utf8'));

      data = Object.assign(data, jsonData);
    }

    await interaction.reply(Object.keys(data).length.toString());
  }
};