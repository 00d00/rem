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
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const field1_name = interaction.options.getString('field1_name');
    const field1_value = interaction.options.getString('field1_value');
    const field2_name = interaction.options.getString('field2_name');
    const field2_value = interaction.options.getString('field2_value');
    const field3_name = interaction.options.getString('field3_name');
    const field3_value = interaction.options.getString('field3_value');
    const field4_name = interaction.options.getString('field4_name');
    const field4_value = interaction.options.getString('field4_value');
    const field5_name = interaction.options.getString('field5_name');
    const field5_value = interaction.options.getString('field5_value');

    const embed = new discord.EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      .setDescription(description);

    for (let i = 1; i <= 5; i++) {
        const fieldName = interaction.options.getString(`field${i}_name`);
        const fieldValue = interaction.options.getString(`field${i}_value`);

        if (fieldName && fieldValue) {
            embed.addFields({ name: fieldName, value: fieldValue });
        } else {
            break;
        }
    }

    await interaction.reply({ embeds: [embed] });
  }
};