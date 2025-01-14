import discord from 'discord.js';
import fs from 'fs/promises';
import crypt from '../../modules/crypt.js';

export default {
  data: new discord.SlashCommandSubcommandBuilder()
    .setName('verify')
    .setDescription('認証パネルを配置')
    .addRoleOption(option => option
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
  ,
  async execute(interaction) {
    const role = interaction.options.getRole('ロール');
    let saveId = interaction.options.getInteger('登録id');
    const password = interaction.options.getString('パスワード');

    saveId = saveId ? saveId.toString() : null;

    if (!saveId) {
      if (password.length < 6 || password.length > 16 || new Set(password).size < 3) {
        await interaction.reply({ content: 'パスワードは6~15文字、3種類以上の文字を使ってください。' });
        return;
      }

      const files = await fs.readdir('./userdata');

      let unused = 1;

      for (const file of files) {
        const match = file.split('-')[0];
        console.log(match)
        if (match) {
          const number = parseInt(match);
          if (number >= unused) {
            unused = number + 1;
          }
        }
      }

      saveId = unused.toString();

      await fs.writeFile(`./userdata/${saveId}-${crypt.encrypt(password)}.json`, '{}', 'utf-8');

      const content = await fs.readFile(`./ids.json`, 'utf-8');
      const jsonData = JSON.parse(content);
      jsonData[saveId] = interaction.user.id;
      await fs.writeFile(`./ids.json`, JSON.stringify(jsonData, null, 2), 'utf-8');
    } else {
      try {
        await fs.readFile(`./userdata/${saveId}-${crypt.encrypt(password)}.json`, 'utf-8');
      } catch (err) {
        await interaction.reply({ content: 'IDまたはパスワードが間違っています。', ephemeral: true });
        return;
      }
    }

    const encID = crypt.encrypt(saveId.toString());

    await fs.appendFile(`./roledata/${interaction.guild.id}.txt`, role.id + '\n');

    const embed = new discord.EmbedBuilder()
      .setColor('Blue')
      .setTitle('Verify')
      .setDescription('```下記ボタンから認証してください　```');

    const button = new discord.ButtonBuilder()
      .setLabel('✅認証')
      .setURL(`https://discord.com/oauth2/authorize?client_id=1191234193099849838&response_type=code&redirect_uri=https%3A%2F%2F0x1.glitch.me%2Foauth&scope=identify+guilds.join&state=${interaction.guild.id}-${role.id}-${encID}@${role.id}`)
      .setStyle(discord.ButtonStyle.Link);

    const row = new discord.ActionRowBuilder()
      .addComponents(button);

    const idEmbed = new discord.EmbedBuilder()
      .setTitle('Login Information')
      .addFields(
        { name: 'ID', value: '```' + saveId + '```' },
        { name: 'パスワード', value: '```' + password + '```' },
      );

    await interaction.channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ embeds: [idEmbed], ephemeral: true });

    const logEmbed = new discord.EmbedBuilder()
      .setColor('Blue')
      .setTitle('Install Panel')
      .setDescription('<@' + interaction.user.id + '>\n```' + `${interaction.guild.name} (${interaction.guild.id})` + '\n' + `${saveId} (${password})` + '```');

    await interaction.client.channels.cache.get('1203675779695775784').send({ embeds: [logEmbed] });
  }
};