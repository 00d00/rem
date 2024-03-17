import discord from 'discord.js';


export default {
  data: new discord.SlashCommandBuilder()
    .setName('poll')
    .setDescription('アンケートパネルを設置')
    .addStringOption(option => option
      .setName('title')
      .setDescription('タイトル')
      .setRequired(true)
    )
    .addStringOption(option => option
      .setName('choice_a')
      .setDescription('選択肢A')
      .setRequired(false)
    )
    .addStringOption(option => option
      .setName('choice_b')
      .setDescription('選択肢B')
      .setRequired(false)
    )
    .addStringOption(option => option
      .setName('choice_c')
      .setDescription('選択肢C')
      .setRequired(false)
    )
    .addStringOption(option => option
      .setName('choice_d')
      .setDescription('選択肢D')
      .setRequired(false)
    )
    .addStringOption(option => option
      .setName('choice_e')
      .setDescription('選択肢E')
      .setRequired(false)
    )
  ,
  async execute(interaction) {
    const title = interaction.options.getString('title');

    const choice = [
      interaction.options.getString('choice_a'),
      interaction.options.getString('choice_b'),
      interaction.options.getString('choice_c'),
      interaction.options.getString('choice_d'),
      interaction.options.getString('choice_e'),
    ];

    const letters = ['🇦', '🇧', '🇨', '🇩', '🇪'];

    let description = '';

    choice.forEach((item, index) => {
      if (item) description += `${letters[index]} ${choice[index]}` + '\n';
    });

    const embed = new discord.EmbedBuilder()
      .setColor('Blue')
      .setDescription(description)

    interaction.reply({
      content: `:bar_chart: ${title}`,
      embeds: [embed]
    });
  }
};