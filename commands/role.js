import discord from "discord.js";

export default {
  data: new discord.SlashCommandBuilder()
    .setName('role')
    .setDescription("ロール付与パネルを設置")

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
  ,
  async execute(interaction) {
    const role = [
      interaction.options.getRole('role1'),
      interaction.options.getRole('role2'),
      interaction.options.getRole('role3'),
      interaction.options.getRole('role4'),
      interaction.options.getRole('role5'),
      interaction.options.getRole('role6'),
      interaction.options.getRole('role7'),
      interaction.options.getRole('role8'),
      interaction.options.getRole('role9')
    ];

    const emoji = [ '1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣' ]

    let result = '';
    let i = 0;

    while (true) {
      if (!role[i]) break;
      const charCode = 97 + i;
      result += `${emoji[i]} : <@&${role[i].id}>\n`;
      i ++;
    }

    await interaction.reply({ content: 'パネルを作成しました', ephemeral: true });

    const embed = new discord.EmbedBuilder()
      .setColor(process.env.COLOR)
      .setTitle('ロール付与パネル')
      .setDescription(result);

    const message = await interaction.channel.send({ embeds: [embed] });


    for (let j = 0; j <= i; j++) {
      const charCode = 97 + j;
      console.log(String.fromCharCode(charCode));
      await message.react(emoji[j]);
    }
  }
};
