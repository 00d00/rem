import discord from 'discord.js';
import fs from 'fs/promises';

export default {
  data: new discord.SlashCommandBuilder()
    .setName('configure')
    .setDescription('configure...')
    .addUserOption(option => option
      .setName('user')
      .setDescription('set user')
      .setRequired(true)
    )
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator)
  ,
  async execute(interaction) {
    await interaction.reply('Hello World');
  }
};
