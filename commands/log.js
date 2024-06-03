import discord from 'discord.js';
import fs from 'fs/promises';

export default {
  data: new discord.SlashCommandBuilder()
    .setName('log')
    .setDescription('log設定')

    .addStringOption(command => command
      .setName('item')
      .setDescription('設定する項目')
      .setRequired(true)
			.addChoices(
				{ name: '入退出', value: 'join' },
				{ name: 'モデレーション', value: 'mod' },
				{ name: 'メッセージ', value: 'message' },
			)
    )
  ,
  async execute(interaction) {
    const item = interaction.options.getString('item');
    console.log(item);
  }
};