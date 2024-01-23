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

    const sortedData = Object.entries(entryCounts)
      .sort((a, b) => b[1] - a[1])
      .reduce((acc, [id, rank]) => {
        acc[id] = rank;
        return acc;
      }, {});

    // ランキングをMarkdown形式で表示
    const markdownRanking = Object.entries(sortedData)
      .map(([id, rank]) => `| ID ${id} | Rank ${rank} |`)
      .join('\n');

    await interaction.reply({ content: `\`\`\`json\n${markdownRanking}\`\`\`` });
  }
}