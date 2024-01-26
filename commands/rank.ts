const discord = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName('rank')
    .setDescription('ランクを表示')
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator)
  ,
  async execute(interaction) {
    function findKeys(obj, searchValue) {
      const foundKeys = [];
      for (const key in obj) {
        if (obj[key] === searchValue) foundKeys.push(key);
      }
      return foundKeys;
    }

    const users = JSON.parse(await fs.readFile('./ids.json', 'utf-8'));

    const keys = findKeys(users, interaction.user.id);
    // ここから

    const files = await fs.readdir('./userdata');

    const entryCounts = {};

    await Promise.all(files.map(async file => {
      if (path.extname(file) === '.json') {
        const content = JSON.parse(await fs.readFile(path.join('./userdata', file), 'utf-8'));
        entryCounts[file.split('-')[0]] = Object.keys(content).length;
      }
    }));


    const sortedEntries = Object.entries(entryCounts).sort((a, b) => b[1] - a[1]);

    let result = '';

    function getRank(points) {
      let rank = 1;
      let requiredPoints = 30;

      while (points >= requiredPoints) {
        rank++;
        requiredPoints = Math.floor(requiredPoints * 1.3);
      }

      return rank;
    }

    sortedEntries.forEach((arr, index) => {
      result += `\`[${index + 1}]\` <@${data[(index + 1).toString()]}> \`ID: ${arr[0]} RANK: ${getRank(arr[1])}\`` + '\n';
    });

    const embed = new discord.EmbedBuilder()
      .setTitle('Ranking')
      .setDescription(result);

    await interaction.reply({ embeds: [embed] });
  }
}