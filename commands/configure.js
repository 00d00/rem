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

    const files = await fs.readdir('./userdata');
    const data = [];

    for (const file of await fs.readdir('./userdata')) {
      const fileData = JSON.parse(await fs.readFile(`./userdata/${file}`, 'utf8'));
      for (const fileData in JSON.parse(await fs.readFile(`./userdata/${file}`, 'utf8')) ) {
        data.push(fileData);
      }
    }

    await interaction.reply(data.length.toString());
    console.log(data);
  }
};