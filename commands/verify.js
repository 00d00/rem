const discord = require('discord.js');
const fs = require('fs').promises;

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName('verify')
    .setDescription('認証パネルを配置')
    .addRoleOption((option) => option
      .setName("role")
      .setDescription('認証時のロールを選択')
      .setRequired(true)
    )
    .addStringOption((option) => option
      .setName("password")
      .setDescription('パスワードを入力')
      .setRequired(true)
    )
    .addIntegerOption((option) => option
      .setName("registid")
      .setDescription('IDを指定')
      .setRequired(false)
    )

    .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator)
  ,
  async execute(interaction) {
    const role = interaction.options.getRole('role');
    const id = interaction.options.getRole('registid');
    const password = interaction.options.getRole('password');

    // await fs.appendFile(`./serverdata/roles/${interaction.guild.id}.txt`, role.id + '\n');
    await fs.writeFile(`./serverdata/${interaction.guild.id}/role.txt`, role.id);

    // state=interaction.guild.id-role.id
    const url = `https://discord.com/api/oauth2/authorize?client_id=1192454684494016583&response_type=code&redirect_uri=https%3A%2F%2Fdiscord-auth-system.glitch.me%2Foauth&scope=identify+guilds.join&state=${interaction.guild.id}-${role.id}`;

    const embed = new discord.EmbedBuilder()
      .setColor(process.env.COLOR)
      .setTitle('Verify')
      .setDescription('```下記ボタンから認証してください　```');

    const button = new discord.ButtonBuilder()
      .setLabel('✅認証')
      .setURL(url)
      .setStyle(discord.ButtonStyle.Link);

    const row = new discord.ActionRowBuilder().addComponents(button);

    await interaction.reply({ embeds: [embed], components: [row] });
  }
}