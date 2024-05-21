import discord from 'discord.js';
import newModal from './newModal.js';
import newItemSelect from './newItemSelect.js';


export async function edit_item(interaction, shop) {
  await newItemSelect(interaction, shop);
  return;
  const row = newItemSelect(interaction, shop);
  const modal = newModal({
    id: 'modal',
    title: '商品編集',
    input: [
      {
        label: '変更する商品名',
        id: 'name',
        style: discord.TextInputStyle.Short
      },
      {
        label: '新しい商品名',
        id: 'new_name',
        style: discord.TextInputStyle.Short
      },
      {
        label: '新しい値段',
        id: 'new_price',
        style: discord.TextInputStyle.Short
      }
    ]
  });

  await interaction.showModal(modal);
  let response;

  try {
    response = await interaction.awaitModalSubmit({ time: 180000 });
  } catch (error) {
    await interaction.followUp({ content: 'タイムアウトしました。', ephemeral: true });
    return;
  }

  const itemName = response.fields.getTextInputValue('name');
  const newName = response.fields.getTextInputValue('new_name');
  const newPrice = response.fields.getTextInputValue('new_price');

  const index = shop.item.findIndex(element => element.name === itemName);

  if (index === -1) {
    await response.reply({ content: '商品が見つかりませんでした。', ephemeral: true });
    return;
  }

  if (isNaN(parseInt(newPrice)) || 999999 < parseInt(newPrice)) {
    await response.reply({ content: '無効な値段です。', ephemeral: true });
    return;
  }

  const validRanges = newName === itemName ? 1 : 0;

  if (shop.item.filter(element => element.name === newName) > validRanges) {
    await response.reply({ content: '既に同じ名前の商品があります。', ephemeral: true });
    return;
  }

  shop.item[index].name = newName;
  shop.item[index].price = newPrice;

  const embed = new discord.EmbedBuilder()
    .setColor('Green')
    .setTitle('商品編集')
    .setDescription(`商品名:${newName}\n値段:${newPrice}`);

  await response.reply({ embeds: [embed], ephemeral: true });
};