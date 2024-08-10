import discord from 'discord.js';
import fs from 'fs/promises';

export default {
  data: new discord.SlashCommandBuilder()
    .setName('info')
    .setDescription('botの情報を表示')
  ,
  async execute(interaction) {
    let data;
    try {
      data = JSON.parse(await fs.readFile(`./automod/${interaction.guild.id}.json`, 'utf-8'));
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

      await fs.writeFile(`./automod/${interaction.guild.id}.json`, JSON.stringify(data), 'utf-8');
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