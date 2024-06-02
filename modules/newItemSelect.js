import discord from 'discord.js';

export default async function(interaction, shop) {
  const options = [];

  shop.item.forEach(data => {
    options.push(
      new discord.StringSelectMenuOptionBuilder()
        .setLabel(`${data.name} : ${data.price}円`)
        .setValue(data.name)
        .setDescription(`在庫数: ${data.infinity_stock ? '∞' : data.stock.length}`)
    );
  });

  const menu = new discord.StringSelectMenuBuilder()
    .setCustomId('item_select')
    .setPlaceholder('商品を選択')
    .addOptions(...options);

  const row = new discord.ActionRowBuilder()
    .addComponents(menu);

  const message = await interaction.reply({ components: [row], ephemeral: true });

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      interaction.client.off('interactionCreate', onFunc);
      reject(new Error('タイムアウトしました'));
    }, 60000);

    async function onFunc(i, check) {
      if (check !== r) return;
      if (i.customId !== 'item_select') return;
      clearTimeout(timeout);
      interaction.client.off('interactionCreate', onFunc);
      resolve(i);
    }

    const r = Math.random();
    interaction.client.on('interactionCreate', (interaction) => onFunc(interaction, r));
  });
};