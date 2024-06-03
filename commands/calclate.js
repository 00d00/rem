import discord from 'discord.js';
import { simplify, evaluate } from 'mathjs';

export default {
  data: new discord.SlashCommandBuilder()
    .setName('calclate')
    .setDescription('計算')
    .addStringOption(option => option
      .setName('formula')
      .setDescription('数式')
      .setRequired(true)
    )
  ,
  async execute(interaction) {
    const formula = interaction.options.getString('formula');

    const embed = new discord.EmbedBuilder()
      .setTitle('計算結果')
      .setDescription(`${formula} = ${evaluate(formula)}`);

    await interaction.reply({ embeds: [embed] });
  }
}