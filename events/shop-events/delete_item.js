import discord from 'discord.js';
import newModal from './newModal.js';
import newItemSelect from './newItemSelect.js';


export async function edit_item(interaction, shop) {
  let i;

  try {
    i = await newItemSelect(interaction, shop);
  } catch (error) {
    const embed = new discord.EmbedBuilder()
      .setColor('Red')
      .setTitle('失敗')
      .setDescription('タイムアウトしました。');

    interaction.editReply({ embeds: [embed], components: [] });
  }

  const itemName = i.values[0]

  const index = shop.item.findIndex(element => element.name === itemName);

  if (index === -1) {
    await i.reply({ content: '商品が見つかりませんでした。', ephemeral: true });
    return;
  }

  shop.item.splice(index, 1);

  const embed = new discord.EmbedBuilder()
    .setColor('Green')
    .setTitle('商品削除')
    .setDescription(`商品名:${itemName}`);
  
  await i.reply({ embeds: [embed], ephemeral: true });
};