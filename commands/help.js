import discord from 'discord.js';


export default {
  data: new discord.SlashCommandBuilder()
    .setName('help')
    .setDescription('コマンドの使用方法を確認')
  ,
  async execute(interaction) {
    const embed = new discord.EmbedBuilder()
      .setColor('Blue')
      .setTitle('Help');

    const select = new discord.StringSelectMenuBuilder()
      .setCustomId('help-select')
      .setPlaceholder('項目を選択')

    for (const key in interaction.client.commands) {
      select.addOptions(
        
      )
    }

    const row = new discord.ActionRowBuilder()
      .addComponents(select);

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};