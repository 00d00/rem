import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { create, all } from 'mathjs';


const math = create(all);

// 数値微分関数を定義
math.import({
  diff: (f, x, h = 1e-5) => {
    const func = math.parse(f).compile();
    return (func.evaluate({ x: x + h }) - func.evaluate({ x: x })) / h;
  }
});

// 数値積分関数を定義
math.import({
  integral: (f, a, b, n = 1000) => {
    const h = (b - a) / n;
    const func = math.parse(f).compile();
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += func.evaluate({ x: a + i * h }) * h;
    }
    return sum;
  }
});


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