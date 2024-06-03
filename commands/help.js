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
      .setCustomId(`help_select-${interaction.user.id}`)
      .setPlaceholder('項目を選択')

    const commands = interaction.client.commands;

    for (const key in commands) {
      select.addOptions(
        new discord.StringSelectMenuOptionBuilder()
          .setLabel(key)
          .setDescription(commands[key].data.description)
          .setValue(key)
      )
    }

    const row = new discord.ActionRowBuilder()
      .addComponents(select);

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};