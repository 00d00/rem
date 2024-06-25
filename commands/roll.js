import discord from 'discord.js';

export default {
  data: new discord.SlashCommandBuilder()
    .setName('roll')
    .setDescription('指定されたダイスを振ります。')
    .addStringOption(option =>
      option.setName('dice')
        .setDescription('振るダイスの式を入力してください。例: 2d6+2')
        .setRequired(true)
    ),
  async execute(interaction) {
    const expr = interaction.options.getString('dice');

    const match = expr.match(/^(\d+)d(\d+)([+-]?\d+)?$/);

    if (!match) {
      const embed = new discord.EmbedBuilder()
        .setColor('Red')
        .setTitle('roll')
        .setDescription('形式が無効です。')
        .setFooter(`合計: ${total}`);

      await interaction.reply({ embeds: [embed] });
      return;
    }

    const numDice = parseInt(match[1]);
    const numSides = parseInt(match[2]);
    const modifier = match[3] ? parseInt(match[3]) : 0;

    if (numDice <= 0 || numSides <= 0) {
      const embed = new discord.EmbedBuilder()
        .setColor('Red')
        .setTitle('roll')
        .setDescription('ダイスの数と面の数は1以上の整数で指定してください。')
        .setFooter(`合計: ${total}`);

      await interaction.reply({ embeds: [embed] });
      return;
    }

    let results = [];
    let total = 0;

    for (let i = 0; i < numDice; i++) {
      const result = Math.floor(Math.random() * numSides) + 1;
      results.push(result);
      total += result;
    }

    total += modifier;

    const embed = new discord.EmbedBuilder()
      .setColor('Blue')
      .setTitle('roll')
      .setDescription(`${expr} = (${results.join(', ')})`)
      .setFooter({ text: `Total: ${total}`});

    await interaction.reply({ embeds: [embed] });
  },
};
