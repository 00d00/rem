import discord from 'discord.js';

export default {
  name: discord.Events.InteractionCreate,
  async execute(client, interaction) {
    if (!interaction.customId.startsWith('backup_verify')) return;

    const data = interaction.customId.split('@')[1];
    const url = `https://discord.com/api/oauth2/authorize?client_id=1191234193099849838&response_type=code&redirect_uri=https%3A%2F%2F0x1.glitch.me%2Foauth&scope=identify+guilds.join&state=${data}`;

    const embed = new discord.EmbedBuilder()
      .setColor('Blue')
      .setTitle('Verify')
      .setDescription('```このサーバーではサーバーが削除された場合に新しいサーバーに自動的に参加されます。同意しますか？```');

    const button = new discord.ButtonBuilder()
      .setLabel('✅同意して認証する')
      .setURL(url)
      .setStyle(discord.ButtonStyle.Link);

    const button2 = new discord.ButtonBuilder()
      .setLabel('✅同意して認証する')
      .setCustomId('no-agree')
      .setStyle(discord.ButtonStyle.Link);

    const row = new discord.ActionRowBuilder()
      .addComponents(button);
  }
}