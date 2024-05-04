import discord from 'discord.js';

export default {
  data: new discord.SlashCommandBuilder()
    .setName('verify_panel')
    .setDescription('認証パネルを生成')
    .addRoleOption(option => option
      .setName('role')
      .setDescription('認証時に付与するロール')
      .setRequired(true)
    )
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator)
  ,
  async execute(interaction) {
    const role = interaction.options.getRole('role');

    const button = new discord.ButtonBuilder()
      .setCustomId(`verify_${role.id}`)
      .setLabel('認証✅')
      .setStyle(discord.ButtonStyle.Success);

    const row = new discord.ActionRowBuilder()
      .addComponents(button);

    const embed = new discord.EmbedBuilder()
      .setColor("Blue")
      .setTitle("認証")
      .setDescription("```下記ボタンから認証してください。```");

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};