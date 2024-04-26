import discord from 'discord.js';
import fs from 'fs/promises';

export default {
  data: new discord.SlashCommandBuilder()
    .setName('shop')
    .setDescription('shop commands')

    .addSubcommand(command => command
      .setName('create')
      .setDescription('ショップを作成')
      .addStringOption(option => option
        .setName('name')
        .setDescription('ショップ名を設定')
        .setRequired(true)
      )
    )

  ,
  async execute(interaction) {
    const command = interaction.options.getSubcommand();


    if (command === 'create') {
      let content;

      try {
        content = JSON.parse( await fs.readFile(`./shop/${interaction.guild.id}.json`, 'utf8') );
      } catch (error) {
        await fs.writeFile(`./shop/${interaction.guild.id}.json`, '{}', 'utf8');
        content = {};
      }
    }

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


    let description = '';

    for (let item in shop) {
      description += `**${item}**\`\`\`${shop[item].price}円\`\`\`\n`;
    }


    const embed = new discord.EmbedBuilder()
      .setColor('Blue')
      .setTitle('Shop');

    if (description.length > 1) {
      embed.setDescription(description);
    }

    await interaction.reply({ embeds: [embed] });
  }
};