import discord from 'discord.js';
import * as math from 'mathjs';
import fs from 'fs/promises';


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
      .setName('solve')
      .setDescription('方程式を計算')
      .addStringOption(option => option
        .setName('formula')
        .setDescription('方程式')
        .setRequired(true)
      )
    )

  ,
  async execute(interaction) {
    const command = interaction.options.getSubcommand();

    if (command === 'solve') {
      const formula = interaction.options.getString('formula');
      const expr = math.parse(formula);
      console.log(expr)

      const embed = new discord.EmbedBuilder()
        .setTitle('計算結果')
        .setDescription(`${formula} = ${math.lsolve(formula)}`);

      await interaction.reply({ embeds: [embed] });
    }

  }
};