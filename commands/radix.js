import discord from 'discord.js';
import fs from 'fs/promises';
import crypt from '../modules/crypt.js';
import { PayPay, PayPayStatus } from "paypax";


export default {
  data: new discord.SlashCommandBuilder()
    .setName('radix')
    .setDescription('radix変換')
    .addIntegerOption(option => option
      .setName('from_radix')
      .setDescription('変換前の基数')
      .setRequired(true)
    )
    .addIntegerOption(option => option
      .setName('to_radix')
      .setDescription('変換後の基数')
      .setRequired(true)
    )
    .addIntegerOption(option => option
      .setName('number')
      .setDescription('変換する数')
      .setRequired(true)
    )
  ,
  async execute(interaction) {
    const from = interaction.options.getInteger('from_radix');
    const to = interaction.options.getInteger('to_radix');
    const number = interaction.options.getInteger('number');

    await interaction.reply(`\`\`\`${parseInt(number, from).toString(to).toUpperCase()}\`\`\``);
  }
};
