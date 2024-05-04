import discord from 'discord.js';

export default {
  name: discord.Events.InteractionCreate,
  async execute(client, interaction) {
    console.log(interaction.isButton);
    if (!interaction.isButton) return;
    if (!interaction.customId.startsWith("verify_")) return;

    const member = interaction.guild.members.cache.get(interaction.user.id);

    await member.roles.add(interaction.customId.slice(7));

    const embed = new discord.EmbedBuilder()
      .setTitle('認証完了')
      .setDescription(`<@${interaction.user.id}> さんの認証が完了しました。`)
      .setColor("Green")

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};