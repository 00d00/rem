import discord from 'discord.js';
import fs from 'fs/promises';





export default {
  data: new discord.SlashCommandBuilder()
    .setName('log')
    .setDescription('log設定')

    .addStringOption(command => command
      .setName('項目')
      .setDescription('編集する項目')
      .addStringOption(option => option
        .setName('name')
        .setDescription('ショップ名を設定')
        .setRequired(true)
      )
    )

  ,
  async execute(interaction) {
    const command = interaction.options.getSubcommand();

    if (command === 'create') {
    }
  }
};
