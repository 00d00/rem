const discord = require('discord.js');

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName('gban')
    .setDescription('guild ban')

    .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator)
  ,
  async execute(interaction) {
    if (!config.admins.includes(interaction.user.id)) return interaction.reply('Missing Permissions');
    
    const guild = client.guilds.cache.get(interaction.options.getString('guild'));
    if (!guild) return interaction.reply('サーバーが存在しません');
    
    const embed = new discord.EmbedBuilder()
      .setColor(process.env.COLOR)
      .setTitle('gban')
      .setDescription('サーバーをBANしました！')


    const row = new discord.ActionRowBuilder().addComponents(button);

    await interaction.reply({ embeds: [embed] });
  }
}