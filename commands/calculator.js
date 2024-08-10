import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { create, all } from 'mathjs';


const math = create(all);


export default {
  data: new SlashCommandBuilder()
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
      result = math.evaluate(expr);
    } catch (error) {
      result = 'Invalid Input';
    }

    const embed = new EmbedBuilder()
      .setColor(result === 'Invalid Input' ? 'Red' : 'Blue')
      .setTitle('calculator')
      .setDescription(result === 'Invalid Input' ? result : `${expr} = ${result}`);

    await interaction.reply({ embeds: [embed] });
  }
};