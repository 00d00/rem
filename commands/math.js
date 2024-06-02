import discord from 'discord.js';
import * as math from 'mathjs';
import Plotly from 'plotly.js-dist';

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
        .setName('function')
        .setDescription('関数')
        .setRequired(true)
      )
    )

  ,
  async execute(interaction) {
    const command = interaction.options.getSubcommand();

    if (command === 'graph') {
      const func = interaction.options.getString('function');

    }

  }
};