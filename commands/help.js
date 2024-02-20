import discord from 'discord.js';

export default {
  data: new discord.SlashCommandBuilder()
    .setName('help')
    .setDescription('ヘルプを表示')
  ,
  async execute(interaction) {
    const back = new discord.ButtonBuilder()
      .setCustomId('back')
      .setLabel('⏪')
      .setStyle(discord.ButtonStyle.Primary);

    const next = new discord.ButtonBuilder()
      .setCustomId('next')
      .setLabel('⏩')
      .setStyle(discord.ButtonStyle.Primary);

    const row = new discord.ActionRowBuilder().addComponents(back, next);

    const embed = new discord.EmbedBuilder()
      .setTitle('help')
      .setDescription('Moderation')
      .addFields({ name })

    const res = await interaction.reply({ embeds: [embed], components: [row] });
  }
};