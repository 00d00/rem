import discord from 'discord.js';
import newModal from './newModal.js';


export async function set_vouch(interaction, shop) {
  

  const menu = new discord.ChannelSelectMenuBuilder()
    .setCustomId('channel_select')
    .setPlaceholder('チャンネルを選択');

  const row = new discord.ActionRowBuilder()
    .addComponents(menu);

  await interaction.reply({ content: 'チャンネルを選択してください。', components: [row], ephemeral: true });
  let response;

  try {
    response = await interaction.awaitMessageComponent({ time: 180000 });
  } catch (error) {
    await interaction.followUp({ content: 'タイムアウトしました。', ephemeral: true });
    return;
  }

  const channel = response.fields.getTextInputValue("channel_select");

  shop.vouch = channel.id;

  const embed = new discord.EmbedBuilder()
    .setColor('Green')
    .setTitle('実績チャンネル変更')
    .setDescription(`実績チャンネルを<#`);

  await response.reply({ embeds: [embed], ephemeral: true });
};