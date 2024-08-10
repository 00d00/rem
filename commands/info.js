import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('BOTの情報を表示します'),
  async execute(interaction) {
    const client = interaction.client;

    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setTitle('Aces BOT INFO')
      .addFields(
        { name: 'Server Count', value: `\`\`\`${client.guilds.cache.size}\`\`\``, inline: true },
        { name: 'Uptime', value: `\`\`\`${Math.floor(client.uptime / 1000)} seconds\`\`\``, inline: true },
        { name: 'Ping', value: `Pinging...`, inline: true },
      );

    const start = Date.now();
    await interaction.reply({ embeds: [embed] });
    const ping = Date.now() - start;

    const newEmbed = new EmbedBuilder()
      .setColor('Blue')
      .setTitle('Aces BOT INFO')
      .addFields(
        { name: 'Server Count', value: `\`\`\`${client.guilds.cache.size}\`\`\``, inline: true },
        { name: 'Uptime', value: `\`\`\`${Math.floor(client.uptime / 1000)} seconds\`\`\``, inline: true },
        { name: 'Ping', value: `\`\`\`${ping} ms\`\`\``, inline: true },
      );

    await interaction.editReply({ embeds: [newEmbed] });
  }
};
