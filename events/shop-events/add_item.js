import discord from 'discord.js';
import newModal from './newModal.js';


export async function add_item(interaction, shop) {
  const modal = newModal({
    id: 'modal',
    title: '商品追加',
    input: [
      {
        label: '商品名',
        id: 'name',
        style: discord.TextInputStyle.Short
      },
      {
        label: '値段',
        id: 'price',
        style: discord.TextInputStyle.Short
      },
      {
        label: '無限在庫(y/n)',
        id: 'infinity-stock',
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

  const inputName = response.fields.getTextInputValue('name');
  const inputPrice = response.fields.getTextInputValue('price');
  let inputInfinityStock = response.fields.getTextInputValue('infinity-stock').toLowerCase();

  if (inputInfinityStock === 'y') inputInfinityStock = true;
  else if (inputInfinityStock === 'n') inputInfinityStock = false;
  else {
    await response.reply({ content: '無限在庫の入力が無効です。', ephemeral: true });
    return;
  }

  if (isNaN(parseInt(inputPrice)) || 999999 < parseInt(inputPrice)) {
    await response.reply({ content: '無効な値段です。', ephemeral: true });
    return;
  }

  if (shop.item.findIndex(element => element.name === inputName) !== -1) {
    await response.reply({ content: '既に同じ名前の商品があります。', ephemeral: true });
    return;
  }

  shop.item.push({ name: inputName, price: parseInt(inputPrice), infinity_stock: inputInfinityStock, stock: [] });

  const embed = new discord.EmbedBuilder()
    .setColor('Green')
    .setTitle('商品追加')
    .setDescription(`商品名: ${inputName}\n値段: ${inputPrice}円`);

  await response.reply({ embeds: [embed], ephemeral: true });
};