const discord = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

module.exports = {
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

    sortedEntries.forEach((arr, index) => {
      result += `\`[${index + 1}]\` <@${data[(index + 1).toString()]}> \`ID: ${arr[0]} RANK: ${arr[1]}\`` + '\n';
    });

    const embed = new discord.EmbedBuilder()
      .setTitle('Ranking')
      .setDescription(result);

    await interaction.reply({ embeds: [embed] });
  }
}