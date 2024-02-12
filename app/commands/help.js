module.exports = {
	data: {
    name: "help",
    description: "ヘルプを表示します。",
  },
	async execute(interaction, discord) {
    const { commandName, options } = interaction;
		    // 埋め込みメッセージを作成するためのオブジェクト
    const embed = {
      title: 'help',
      color: 0x3498DB, // カラーコード
      description: "### [botを導入する](https://discord.com/api/oauth2/authorize?client_id=1139141587214028862&permissions=8&scope=bot%20applications.commands)",
    };

    // 埋め込みメッセージを送信
    await interaction.reply({ embeds: [embed] });
	}
}