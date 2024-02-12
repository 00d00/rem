import discord from "discord.js";

export default {
  data: new discord.SlashCommandBuilder()
    .setName('role')
    .setDescription("ロール付与パネルを設置")
    .addStringOption((option) =>option
      .setName('title')
      .setDescription('タイトル')
      .setRequired(true)
    )

    .addRoleOption((option) =>option
      .setName('role1')
      .setDescription('ロール1')
      .setRequired(true)
    )
    .addRoleOption((option) =>option
      .setName('role2')
      .setDescription('ロール2')
      .setRequired(false)
    )
    .addRoleOption((option) =>option
      .setName('role3')
      .setDescription('ロール3')
      .setRequired(false)
    )
    .addRoleOption((option) =>option
      .setName('role4')
      .setDescription('ロール4')
      .setRequired(false)
    )
    .addRoleOption((option) =>option
      .setName('role5')
      .setDescription('ロール5')
      .setRequired(false)
    )
    .addRoleOption((option) =>option
      .setName('role6')
      .setDescription('ロール6')
      .setRequired(false)
    )
    .addRoleOption((option) =>option
      .setName('role7')
      .setDescription('ロール7')
      .setRequired(false)
    )
    .addRoleOption((option) =>option
      .setName('role8')
      .setDescription('ロール8')
      .setRequired(false)
    )
    .addRoleOption((option) =>option
      .setName('role9')
      .setDescription('ロール9')
      .setRequired(false)
    )
    .addRoleOption((option) =>option
      .setName('role10')
      .setDescription('ロール10')
      .setRequired(false)
    )
  ,
  async execute(interaction) {
    const role1 = interaction.options.getRole('role1');
    const role2 = interaction.options.getRole('role2');
    const role3 = interaction.options.getRole('role3');
    const role4 = interaction.options.getRole('role4');
    const role5 = interaction.options.getRole('role5');
    const role6 = interaction.options.getRole('role6');
    const role7 = interaction.options.getRole('role7');
    const role8 = interaction.options.getRole('role8');
    const role9 = interaction.options.getRole('role9');
    const role10 = interaction.options.getRole('role10');

    const embed = new discord.EmbedBuilder()
      .setColor(process.env.COLOR)
      .setThumbnail("https://i.imgur.com/AfFp7pu.png")
      .setTitle("log-channel")
      .setDescription("設定を変更しました！");

    await interaction.reply({ embeds: [embed] });
  }
};
