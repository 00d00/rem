import discord from 'discord.js';

export default {
  data: new discord.SlashCommandBuilder()
    .setName('clear')
    .setDescription('メッセージを削除')
    .addIntegerOption(option => option
      .setName('count')
      .setDescription('削除するメッセージ数')
      .setRequired(true)
    )
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.ManageMessages)
  ,
  async execute(interaction) {
    const count = interaction.options.getInteger('count');

    if (count < 2 || count > 100) {
      const embed = new discord.EmbedBuilder()
        .setColor('Red')
        .setTitle('clear')
        .setDescription(`削除件数は2~100にしてください。`);

      await interaction.reply({ embeds: [embed] });
      return;
    }

    await interaction.channel.bulkDelete(count);

    const embed = new discord.EmbedBuilder()
      .setColor('Blue')
      .setTitle('clear')
      .setDescription(`メッセージを${count}件削除しました。`);

    await interaction.reply({ embeds: [embed] });
  }
};