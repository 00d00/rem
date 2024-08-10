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
    const expr = interaction.options.getInteger('expr');

    try {
      const result = evaluate(expr);
    }
    
    const embed = new discord.EmbedBuilder()
      .setColor(result ? 'Blue' : 'Red')
      .setTitle('calculator')
      .setDescription(`${expr} = ${result}`);

    await interaction.reply({ embeds: [embed] });
  }
};