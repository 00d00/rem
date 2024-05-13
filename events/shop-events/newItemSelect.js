import discord from 'discord.js';

export default function(interaction, shop) {
  const options = [];

  shop.item.forEach(data => {
    options.push(
      new discord.StringSelectMenuOptionBuilder()
        .setLabel(data.name)
        .setValue(data.name)
    );
  });

  const menu = new discord.StringSelectMenuBuilder()
    .setCustomId('item_select')
    .setPlaceholder('商品を選択')
    .addOptions(...options);

  return new discord.ActionRowBuilder()
    .addComponents(menu);
}