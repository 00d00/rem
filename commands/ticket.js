import discord from 'discord.js';

export default {
  data: new discord.SlashCommandBuilder()
    .setName('ticket')
    .setDescription('チケット発行パネルを設置')
    .addStringOption(option => option
      .setName('title')
      .setDescription('タイトルを設定')
      .setRequired(false)
    )
    .addStringOption(option => option
      .setName('description')
      .setDescription('説明を設定')
      .setRequired(false)
    )
    .addStringOption(option => option
      .setName('label')
      .setDescription('ボタンのラベルを設定')
      .setRequired(false)
    )
    .addRoleOption(option => option
      .setName('role')
      .setDescription('対応ロールを設定')
      .setRequired(false)
    )
    .addChannelOption(option => option
      .setName('category')
      .setDescription('カテゴリを設定')
      .addChannelTypes(discord.ChannelType.GuildCategory)
      .setRequired(false)
    )
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator)
  ,
  async execute(interaction) {
    const title = interaction.options.getString('title') ?? 'チケット発行パネル';
    const description = interaction.options.getString('description') ?? '下記ボタンからチケットを発行してください。';
    const label = interaction.options.getString('label') ?? '発行';

    const role = interaction.options.getRole('role') ?? null;
    const category = interaction.options.getChannel('category') ?? (interaction.channel.parent ? interaction.channel.parent.id : null );

    const data = {};

    if (role) data.role = role.id;
    if (category) data.category = category.id;
  

    const embed = new discord.EmbedBuilder()
      .setColor('Green')
      .setTitle(title)
      .setDescription(description);

    const button = new discord.ButtonBuilder()
      .setCustomId(`ticket-${JSON.stringify(data)}`)
      .setLabel(label)
      .setStyle(discord.ButtonStyle.Success);

    const row = new discord.ActionRowBuilder()
      .addComponents(button);

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};
