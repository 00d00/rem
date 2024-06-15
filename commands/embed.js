import discord from 'discord.js';
import { evaluate } from 'mathjs';

export default {
  data: new discord.SlashCommandBuilder()
    .setName('embed')
    .setDescription('embedを送信')

    .addStringOption(option => option
      .setName('color')
      .setDescription('色')
      .setRequired(true)
    )
    .addStringOption(option => option
      .setName('title')
      .setDescription('タイトル')
      .setRequired(true)
    )
    .addStringOption(option => option
      .setName('description')
      .setDescription('説明')
      .setRequired(true)
    )
    .addStringOption(option => option
      .setName('field1_name')
      .setDescription('フィールド1の名前')
      .setRequired(false)
    )
    .addStringOption(option => option
      .setName('field1_value')
      .setDescription('Field(,で名前と値を区切る)')
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
};