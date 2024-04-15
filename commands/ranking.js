import discord from 'discord.js';
import fs from 'fs/promises';
import path from 'path';

function format(value) {
  if (value < 1000) {
    return Number.isInteger(value) ? value.toString() : value.toFixed(1);
  }

  let suffix = '';

  if (value < 1000000) {
    value = value / 1000;
    suffix = 'k';
  } else if (value < 1000000000) {
    value = value / 1000000;
    suffix = 'm';
  }

  return Number.isInteger(value) ? value.toString() + suffix : value.toFixed(1) + suffix;
}

function padStrings(...strings) {
    const maxLength = Math.max(...strings.map(str => str.length));
    return strings.map(str => str.padEnd(maxLength));
}

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
    let name = [];

    sortedEntries.slice(0, 10).forEach((arr, index) => {
      const user = interaction.client.users.cache.get(data[arr[0]]);
      name.push(user.tag);
    });

    name = padStrings(...name);

    let i = 0;

    sortedEntries.slice(0, 10).forEach((arr, index) => {
      const user = interaction.client.users.cache.get(data[arr[0]]);

      let support1 = index + 1 === 10 ? '' : ' ';

      result += `\`[${support1}${index + 1}] ${name[i]} ID: ${arr[0]} | ${format(arr[1])}pts\`` + '\n';
      i++;
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