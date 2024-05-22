import discord from 'discord.js';
import newModal from './newModal.js';
import newCustomMenu from './newCustomMenu.js';


export async function set_vouch(interaction, shop) {
  const i = await newCustomMenu(interaction, shop, 'Channel');

  const channel = i.channels.get(i.values[0]);

  if (channel.type !== discord.ChannelType.GuildText) {
    const embed = new discord.EmbedBuilder()
      .setColor('Red')
      .setTitle('失敗')
      .setDescription('チャンネルを選択してください。');

    await i.reply({ embeds: [embed], ephemeral: true });
    return;
  }

  shop.vouch = channel.id;

  const embed = new discord.EmbedBuilder()
    .setColor('Green')
    .setTitle('実績チャンネル変更')
    .setDescription(`実績チャンネルを<#${channel.id}>に変更しました。`);

  await i.reply({ embeds: [embed], ephemeral: true });
};