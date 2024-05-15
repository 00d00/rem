import discord from 'discord.js';
import newModal from './newModal.js';


export async function set_vouch(interaction, shop) {
  const menu = new discord.ChannelSelectMenuBuilder()
    .setCustomId('channel_select')
    .setPlaceholder('商品を選択');

  const row = new discord.ActionRowBuilder()
    .addComponents(menu);

  await interaction.reply({ content: '', components: [row] });
  let response;

  try {
    response = await interaction.awaitModalSubmit({ time: 180000 });
  } catch (error) {
    await interaction.followUp({ content: 'タイムアウトしました。', ephemeral: true });
    return;
  }

  const inputName = response.fields.getTextInputValue("name");
  const inputPrice = response.fields.getTextInputValue("price");

  if (isNaN(parseInt(inputPrice)) || 999999 < parseInt(inputPrice)) {
    await response.reply({ content: '無効な値段です。', ephemeral: true });
    return;
  }

  if (shop.item.findIndex(element => element.name === inputName) !== -1) {
    await response.reply({ content: '既に同じ名前の商品があります。', ephemeral: true });
    return;
  }

  shop.item.push({ name: inputName, price: inputPrice });

  const embed = new discord.EmbedBuilder()
    .setColor('Green')
    .setTitle('商品追加')
    .setDescription(`商品名:${inputName}\n値段:${inputPrice}`);

  await response.reply({ embeds: [embed], ephemeral: true });
};