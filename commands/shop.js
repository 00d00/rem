import discord from 'discord.js';
import fs from 'fs/promises';

export default {
  data: new discord.SlashCommandBuilder()
    .setName('shop')
    .setDescription('shopパネルを作成します')
    .addStringOption(option => option
      .setName('id')
      .setDescription('idを設定')
      .setRequired(true)
    )
  ,
  async execute(interaction) {
    const id = interaction.options.getString('id');

    let content = '';

    try {
      content = JSON.parse( await fs.readFile(`./shop/${interaction.guild.id}.json`, 'utf8') );
    } catch (error) {
      await fs.writeFile(`./shop/${interaction.guild.id}.json`, '{}', 'utf8');
      content = {};
    }
    
    content[id] = content[id] || {};
    const shop = content[id];


    for (let item in shop) {
      
    }



    const embed = new discord.EmbedBuilder()
      .setColor('Blue')
      .setTitle('Shop')

    await interaction.reply({ embeds: [embed] });
  }
};