module.exports = {
  data: {
    name: "userinfo",
    description: "ユーザーの詳細情報を表示します。",
    options: [{
      type: "USER",
      name: "ユーザー",
      description: "ユーザーの指定",
      required: false
    }],
  },
  async execute(interaction, discord) {
    const { commandName, options } = interaction;
    const user = options.getUser('ユーザー') || interaction.user;

    // ユーザー情報を取得
    const member = interaction.guild.members.cache.get(user.id);

    // 埋め込みメッセージを作成するためのオブジェクト
    const embed = {
      title: 'ユーザー情報',
      color: 0x3498DB, // カラーコード
      description: `**ユーザー名:** ${user.tag}\n**ユーザーID:** ${user.id}\n\n**サーバー参加日:** ${member.joinedAt.toDateString()}`,
      thumbnail: { url: user.displayAvatarURL({ dynamic: true }) },
    };

    // 埋め込みメッセージを送信
    await interaction.reply({ embeds: [embed] });
  }
}