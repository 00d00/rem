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
        keywords: [],
        mentionable: 0,
        punishments: [ // WARN / TIMEOUT / KICK / BAN
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ],
        points: {
          invite: 0,
          everyone: 0,
          duplicate: 0,
        }
      };
    }

    const embed = new discord.EmbedBuilder()
      .setColor('Blue')
      .setTitle('Automod Settings')
      .addFields(
        { name: 'サーバーログ', value: data.log ? `` : '無し' }
      );

    await interaction.reply({ embeds: [embed] });
  }
};