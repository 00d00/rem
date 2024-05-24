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

  const itemName = i.values[0];


  const modal = newModal({
    id: 'modal',
    title: '商品編集',
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
      }
    ]
  });

  await i.showModal(modal);
  let response;

  try {
    response = await i.awaitModalSubmit({ time: 180000 });
  } catch (error) {
    await interaction.followUp({ content: 'タイムアウトしました。', ephemeral: true });
    return;
  }

  const inputName = response.fields.getTextInputValue('name');
  const inputPrice = response.fields.getTextInputValue('price');

  const index = shop.item.findIndex(element => element.name === itemName);

  if (isNaN(parseInt(inputPrice)) || 999999 < parseInt(inputPrice)) {
    await response.reply({ content: '無効な値段です。', ephemeral: true });
    return;
  }

  const validRanges = inputName === itemName ? 1 : 0;

  if (shop.item.filter(element => element.name === inputName) > validRanges) {
    await response.reply({ content: '既に同じ名前の商品があります。', ephemeral: true });
    return;
  }

  shop.item[index].name = inputName;
  shop.item[index].price = inputPrice;

  const embed = new discord.EmbedBuilder()
    .setColor('Green')
    .setTitle('商品編集')
    .setDescription(`商品名: ${inputName}\n値段: ${inputPrice}円`);
  
  await response.reply({ embeds: [embed], ephemeral: true });
};