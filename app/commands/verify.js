module.exports = {
  data: {
    name: "verify",
    description: "認証パネルを設置します。",
    options: [{
      type: "ROLE",
      name: "ロール",
      description: "ロールの指定",
      required: true
    }],
  },
  async execute(interaction, discord) {
    const { commandName, options } = interaction;
    
    // 埋め込みメッセージを作成するためのオブジェクト
    const embed = {
      title: "Verify",
      color: 0x3498db, // カラーコード
      description: "下記ボタンから認証してください",
      fields: [
        {
          name: '付与されるロール: ',
          value: '<@&'+options.getRole('ロール').id+'>',
          inline: false, // フィールドをインラインに表示しない
        }
      ]
    };

    const button = new discord.MessageButton()
      .setStyle("PRIMARY") // ボタンのスタイルを設定
      .setLabel("認証する") // ボタンのラベルを設定
      .setCustomId("verify"); // カスタムIDを設定

    const row = new discord.MessageActionRow().addComponents(button);
    const msg = await interaction.reply({ embeds: [embed], components: [row] });
    
  },
};
