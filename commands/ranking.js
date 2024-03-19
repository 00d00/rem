import discord from 'discord.js';
import fs from 'fs/promises';
import path from 'path';


export default {
  data: new discord.SlashCommandBuilder()
    .setName('ranking')
    .setDescription('ランキングを表示')
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator)
  ,
  async execute(interaction) {
    const files = await fs.readdir('./userdata');

    const entryCounts = {};

    await Promise.all(files.map(async file => {
      if (path.extname(file) === '.json') {
        const content = JSON.parse(await fs.readFile(path.join('./userdata', file), 'utf-8'));
        entryCounts[file.split('-')[0]] = Object.keys(content).length;
      }
    }));

    const data = JSON.parse(await fs.readFile('./ids.json', 'utf-8'));

    const sortedEntries = Object.entries(entryCounts).sort((a, b) => b[1] - a[1]);
    let result = '';


    sortedEntries.slice(0, 10).forEach((arr, index) => {
      const user = interaction.client.users.cache.get(data[arr[0]]);

      result += `\`[${index + 1}]\` <@${data[arr[0]]}> \`ID: ${arr[0]} | ${arr[1]}pts\`` + '\n';
    });

    const embed = new discord.EmbedBuilder()
      .setTitle('Ranking')
      .setDescription(result)
      .setFooter({ text: 'p1' });


    const back = new discord.ButtonBuilder()
      .setCustomId('ranking-back')
      .setLabel('⏪️')
      .setStyle(discord.ButtonStyle.Secondary);

    const next = new discord.ButtonBuilder()
      .setCustomId('ranking-next')
      .setLabel('⏩️')
      .setStyle(discord.ButtonStyle.Secondary);

    const row = new discord.ActionRowBuilder()
      .addComponents(back, next);


    await interaction.reply({ embeds: [embed], components: [row]});
  }
}