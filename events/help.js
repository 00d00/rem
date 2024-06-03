import discord from 'discord.js';
import * as help from './help-data/index.js';

export default {
  name: discord.Events.InteractionCreate,
  async execute(client, interaction) {
    if (!interaction.customId.startsWith('help_select')) return;
    if (!interaction.customId.endsWith(interaction.user.id)) return;

    const member = interaction.guild.members.cache.get(interaction.user.id);

    await member.roles.add(interaction.customId.slice(7));

    const embed = new discord.EmbedBuilder()
      .setTitle('認証完了')
      .setDescription(`<@${interaction.user.id}> さんの認証が完了しました。`)
      .setColor("Green")

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};