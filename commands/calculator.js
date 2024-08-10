import discord from 'discord.js';
import { evaluate } from 'mathjs';

export default {
  data: new discord.SlashCommandBuilder()
    .setName('calculator')
    .setDescription('最強の計算機')
    .addStringOption(option => option
      .setName('expr')
      .setDescription('計算式')
      .setRequired(true)
    )
  ,
  async execute(interaction) {
    const expr = interaction.options.getString('expr');
    let result;

    try {
      result = evaluate(expr);
    } catch (error) {
      result = 'Invalid Input';
    }

    const embed = new discord.EmbedBuilder()
      .setColor(result === 'Invalid Input' ? 'Red' : 'Blue')
      .setTitle('calculator')
      .setDescription(result === 'Invalid Input' ? result : `${expr} = ${result}`);

    await interaction.reply({ embeds: [embed] });
  }
};