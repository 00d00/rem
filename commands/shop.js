import discord from 'discord.js';


export default {
  data: new discord.SlashCommandBuilder()
    .setName('shop')
    .setDescription('shopパネルを作成します')
    .addStringOption(option => option
      .setName('id')
      .setDescription('idを設定')
      .setRequired(true)
    )
  ,
  async execute(interaction) {
    const id = interaction.options.getString('id');

    const embed = new discord.EmbedBuilder()
      .setColor('Blue')
      .setTitle('Shop')

    await interaction.reply({ embeds: [embed] });
  }
};