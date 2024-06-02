import discord from 'discord.js';
import * as math from 'mathjs';
import pl from 'plotly';
import fs from 'fs/promises';

const plotly = pl();

export default {
  data: new discord.SlashCommandBuilder()
    .setName('math')
    .setDescription('math commands')

    .addSubcommand(command => command
      .setName('calclate')
      .setDescription('数式を計算')
      .addStringOption(option => option
        .setName('formula')
        .setDescription('数式')
        .setRequired(true)
      )
    )

    .addSubcommand(command => command
      .setName('graph')
      .setDescription('グラフを生成')
      .addStringOption(option => option
        .setName('expr')
        .setDescription('関数')
        .setRequired(true)
      )
    )

  ,
  async execute(interaction) {
    const command = interaction.options.getSubcommand();

    if (command === 'graph') {
      const expr = interaction.options.getString('expr');

      const data = [{ x: [1, 2, 3], y: [1, 2, 3], type: 'scatter' }];
      const layout = { title: 'グラフ', xaxis: { title: 'x軸' }, yaxis: { title: 'y軸' } };
      const figure = { data: data, layout: layout };

      plotly.getImage(figure, { format: 'png', width: 800, height: 600 }, async (err, imageStream) => {
        const fileName = 'graph.png';
        const fileStream = await fs.writeFile(fileName, imageStream);
        await interaction.reply({ files: [fileName] });
      });
    }

  }
};