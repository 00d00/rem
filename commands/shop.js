import discord from 'discord.js';


export default {
  data: new discord.SlashCommandBuilder()
    .setName('shop')
    .setDescription('shopパネルを作成します')
  ,
  async execute(interaction) {
    const embed = new discord.EmbedBuilder()
      .setColor('Blue')
      .setTitle('Backup Help')
      .setDescription(
        '**/verify [password] [id]**\n' +
        '認証パネルを設置します。idはある場合指定することができます。\n' +
        '生成されたidとパスワードは忘れないようにしてください。\n' +
        '\n' +
        '**/restore [password] [id]**\n' +
        'メンバーを復元します。\n' +
        '\n' +
        '**/count [passord] [id]**\n' +
        '認証者数を表示します。\n' +
        '\n' +
        '**/ranking**\n' +
        '認証者数ランキングを見れます。'
      )
    await interaction.reply({ embeds: [embed] });
  }
};