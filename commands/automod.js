import discord from 'discord.js';
import fs from 'fs/promises';

export default {
  data: new discord.SlashCommandBuilder()
    .setName('automod')
    .setDescription('セキュリティ設定')
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator)
  ,
  async execute(interaction) {
    let data;
    try {
      data = await fs.readFile(`./automod/${interaction.guild.id}.json`);
    } catch (error) {
      data = {
        log: null,
        keywords: [],
        mentionable: 0,
        
      };
    }

    const embed = new discord.EmbedBuilder()
      .setColor('Blue')
      .setTitle('Automod Settings')
      .addFields(
        { name: 'モデレーターログ', value: modChannel }
      );

    await interaction.reply({ embeds: [embed] });
  }
};