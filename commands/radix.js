import discord from 'discord.js';
import fs from 'fs/promises';
import crypt from '../modules/crypt.js';
import { PayPay, PayPayStatus } from "paypax";


export default {
  data: new discord.SlashCommandBuilder()
    .setName('radix')
    .setDescription('radix変換')
    .addUserOption(option => option
      .setName('user')
      .setDescription('set user')
      .setRequired(true)
    )
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator)
  ,
  async execute(interaction) {
    if (interaction.user.id !== '1097780939368714310') {
      await interaction.reply('Admin Only');
      return;
    }
  }
};
