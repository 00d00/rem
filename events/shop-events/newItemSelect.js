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

  const message = await interaction.reply({ components: [row] });
  let res;

  try {
    res = await message.awaitMessageComponent({
      filter: i => i.user.id === interaction.user.id,
      time: 180000
    });
  } catch (error) {
    await interaction.followUp({ content: 'タイムアウトしました。', ephemeral: true });
    return;
  }

  res.reply('せいこー')
  console.log(res)
}