import discord from 'discord.js';

export default {
  data: new discord.SlashCommandBuilder()
    .setName('ticket')
    .setDescription('チケット発行パネルを設置')
    .addStringOption(option => option
      .setName('タイトル')
      .setDescription('タイトルを設定')
      .setRequired(false)
    )
    .addStringOption(option => option
      .setName('説明')
      .setDescription('説明を設定')
      .setRequired(false)
    )
    .addStringOption(option => option
      .setName('ラベル')
      .setDescription('ボタンのラベルを設定')
      .setRequired(false)
    )
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator)
  ,
  async execute(interaction) {
    const title = interaction.options.getString('タイトル') ?? 'チケット発行パネル';
    const description = interaction.options.getString('説明') ?? '下記ボタンからチケットを発行してください。';
    const label = interaction.options.getString('ラベル') ?? '発行';

    const embed = new discord.EmbedBuilder()
      .setColor(process.env.COLOR)
      .setTitle(title)
      .setDescription(description);

    const button = new discord.ButtonBuilder()
      .setCustomId('ticket')
      .setLabel(label)
      .setStyle(discord.ButtonStyle.Success);

    const row = new discord.ActionRowBuilder()
      .addComponents(button);

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};
