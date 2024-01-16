const discord = require('discord.js');
const fs = require('fs').promises;
const crypto = require('crypto');

const crypt = require('../modules/crypt.js')

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName('verify')
    .setDescription('認証パネルを配置')
    .addIntegerOption((option) => option
      .setName("登録id")
      .setDescription('IDを指定')
      .setRequired(false)
    )
    .addStringOption((option) => option
      .setName("パスワード")
      .setDescription('パスワードを入力')
      .setRequired(true)
    )

    .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator)
  ,
  async execute(interaction) {
    // 引数取得
    const role = interaction.options.getRole('ロール');
    let saveId = interaction.options.getString('登録id');
    const password = interaction.options.getString('パスワード');

    const encrypted = crypt.encrypt(password);

    if (!saveId) {
      // ID新規作成の処理

      if (password < 6 || password > 16|| new Set(password).size < 3 || password.includes('-')) {
        interaction.reply({ content: 'パスワードは6~15文字、3種類以上の文字を使ってください。', ephemeral: true });
        return;
      }

      // id生成
      const files = await fs.readdir('./userdata');

      let maxNumber = 0;

      for (const file of files) {
        const match = file.match(/^\d+\.json$/);
        if (match) {
          const number = parseInt(match[0]);
          if (!isNaN(number) && number > maxNumber) {
            maxNumber = number;
          }
        }
      }

      saveId = (maxNumber + 1).toString();

      await fs.writeFile(`./userdata/${saveId}-${crypt.encrypt(saveId)}`, '{}');
    } else {
      // 既存のID使用の処理
      try {
        await fs.readFile(`./userdata/${saveId}-${crypt.encrypt(saveId)}`, 'utf-8');
      } catch(err) {
        interaction.reply({ content: 'IDまたはパスワードが間違っています。', ephemeral: true })
        return;
      }
    }

    const encID = crypt.encrypt(saveId);
    // 指定されたロールの付与を許可する
    await fs.appendFile(`./roledata/${interaction.guild.id}.txt`, role.id + '\n');

    // state=interaction.guild.id-role.id-encID
    const url = `https://discord.com/api/oauth2/authorize?client_id=1192454684494016583&response_type=code&redirect_uri=https%3A%2F%2Fdiscord-auth-system.glitch.me%2Foauth&scope=identify+guilds.join&state=${interaction.guild.id}-${role.id}-${encID}`;

    const embed = new discord.EmbedBuilder()
      .setColor(process.env.COLOR)
      .setTitle('Verify')
      .setDescription('```下記ボタンから認証してください　```');

    const button = new discord.ButtonBuilder()
      .setLabel('✅認証')
      .setURL(url)
      .setStyle(discord.ButtonStyle.Link);

    const row = new discord.ActionRowBuilder().addComponents(button);

    await interaction.reply({ content: `ID: ${saveId} PASSWORD: ${password}` });
    await interaction.channel.send({ embeds: [embed], components: [row] });
  }
}