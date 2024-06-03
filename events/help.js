import discord from 'discord.js';
import * as help from './help-data/index.js';

export default {
  name: discord.Events.InteractionCreate,
  async execute(client, interaction) {
    if (!interaction.customId) return;
    if (!interaction.customId.startsWith('help_select')) return;
    if (!interaction.customId.endsWith(interaction.user.id)) return;

    const command = interaction.values[0];

    const description = help[command] || 'このコマンドのhelpは登録されていません。';

    const embed = new discord.EmbedBuilder()
      .setColor('Blue')
      .setTitle(`help-${command}`)
      .setDescription(description)

    await interaction.message.edit({ embeds: [embed] });
  }
};