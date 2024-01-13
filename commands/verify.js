const discord = require('discord.js');
const fs = require('fs').promises;
const crypto = require('crypto');

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName('verify')
    .setDescription('認証パネルを配置')
    .addRoleOption((option) => option
      .setName("ロール")
      .setDescription('認証時のロールを選択')
      .setRequired(true)
    )
    .addStringOption((option) => option
      .setName("パスワード")
      .setDescription('パスワードを入力')
      .setRequired(true)
    )
    .addIntegerOption((option) => option
      .setName("登録id")
      .setDescription('IDを指定')
      .setRequired(false)
    )

    .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator)
  ,
  async execute(interaction) {
    // 引数取得
    const role = interaction.options.getRole('ロール');
    const saveId = interaction.options.getRole('登録id');
    const password = interaction.options.getRole('パスワード');
  
    
    if (!saveId) {
      // パスワードチェッカー
      if (password < 8 || new Set(password).size < 3) {
        interaction.reply('パスワードは8文字以上、3種類以上の文字を使ってください。');
      }

      // id生成
    }


    // 指定されたロールの付与を許可する
    await fs.appendFile(`./roledata/${interaction.guild.id}.txt`, role.id + '\n');

    // 暗号化
    const encrypted = require('./module/crypt.js').encrypt(password);

    // state=interaction.guild.id-role.id
    const url = `https://discord.com/api/oauth2/authorize?client_id=1192454684494016583&response_type=code&redirect_uri=https%3A%2F%2Fdiscord-auth-system.glitch.me%2Foauth&scope=identify+guilds.join&state=${interaction.guild.id}-${role.id}-${saveId}`;

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