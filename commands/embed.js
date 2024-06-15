import discord from 'discord.js';
import { evaluate } from 'mathjs';

export default {
  data: new discord.SlashCommandBuilder()
    .setName('embed')
    .setDescription('embedを送信')

    .addStringOption(option => option
      .setName('color')
      .setDescription('色')
      .setRequired(true)
    )
    .addStringOption(option => option
      .setName('title')
      .setDescription('タイトル')
      .setRequired(true)
    )
    .addStringOption(option => option
      .setName('description')
      .setDescription('説明')
      .setRequired(true)
    )

    .addStringOption(option => option
      .setName('field1_name')
      .setDescription('フィールド1の名前')
      .setRequired(false)
    )
    .addStringOption(option => option
      .setName('field1_value')
      .setDescription('フィールド1の値')
      .setRequired(false)
    )

    .addStringOption(option => option
      .setName('field2_name')
      .setDescription('フィールド2の名前')
      .setRequired(false)
    )
    .addStringOption(option => option
      .setName('field2_value')
      .setDescription('フィールド2の値')
      .setRequired(false)
    )

    .addStringOption(option => option
      .setName('field3_name')
      .setDescription('フィールド3の名前')
      .setRequired(false)
    )
    .addStringOption(option => option
      .setName('field3_value')
      .setDescription('フィールド3の値')
      .setRequired(false)
    )

    .addStringOption(option => option
      .setName('field4_name')
      .setDescription('フィールド4の名前')
      .setRequired(false)
    )
    .addStringOption(option => option
      .setName('field4_value')
      .setDescription('フィールド4の値')
      .setRequired(false)
    )

    .addStringOption(option => option
      .setName('field5_name')
      .setDescription('フィールド5の名前')
      .setRequired(false)
    )
    .addStringOption(option => option
      .setName('field5_value')
      .setDescription('フィールド5の値')
      .setRequired(false)
    )
  ,
  async execute(interaction) {
    const color = interaction.options.getString('color');
    const title = interaction.options.getString('title').replace('\\n', '\n');
    const description = interaction.options.getString('description').replace('\\n', '\n');

    const embed = new discord.EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      .setDescription(description);

    for (let i = 1; i <= 5; i++) {
        const fieldName = interaction.options.getString(`field${i}_name`);
        const fieldValue = interaction.options.getString(`field${i}_value`);

        if (fieldName && fieldValue) {
            embed.addFields({ name: fieldName.replace('\\n', '\n'), value: fieldValue.replace('\\n', '\n') });
        } else {
            break;
        }
    }

    await interaction.reply({ embeds: [embed] });
  }
};