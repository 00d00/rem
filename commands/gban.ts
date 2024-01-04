const discord = require('discord.js');

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName('gban')
    .setDescription('guild ban')
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator)
  ,
  async execute(interaction) {
    if (interaction.user.id !== '1192298895368257629') return interaction.reply('Missing Permissions!');
    
    const embed = new discord.EmbedBuilder()
      .setColor(process.env.COLOR)
      .setTitle('Verify')
      .setDescription('下記ボタンから認証してください')

    const button = new discord.ButtonBuilder()
      .setLabel('✅認証')
      .setURL('https://example.com')
      .setStyle(discord.ButtonStyle.Link);

    const row = new discord.ActionRowBuilder().addComponents(button);

    await interaction.reply({ embeds: [embed], components: [row] });
  }
}