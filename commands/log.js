import discord from 'discord.js';
import fs from 'fs/promises';

export default {
  data: new discord.SlashCommandBuilder()
    .setName('log')
    .setDescription('log設定')

    .addStringOption(command => command
      .setName('項目')
      .setDescription('編集する項目')
      .setRequired(true)
			.addChoices(
				{ name: '入退出', value: 'log_join' },
				{ name: 'モデレーション', value: 'log_mod' },
				{ name: 'メッセージ', value: 'log_message' },
			)
    )

    .addStringOption(command => command
      .setName('チャンネル')
      .setDescription('送信するチャンネル')
      .setRequired(false)
    )

  ,
  async execute(interaction) {
  }
};