import discord from 'discord.js';

export default async function(interaction, shop) {
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

  const row = new discord.ActionRowBuilder()
    .addComponents(menu);

  const message = await interaction.reply({ components: [row], ephemeral: true });


    const collector = message.createMessageComponentCollector({
      componentType: discord.ComponentType.Button,
      time: 3600000,
    });

    collector.on("collect", async (i) => {
      await i.reply('せいこう');
    });

}