import discord from 'discord.js';
import newModal from './newModal.js';
import newItemSelect from './newItemSelect.js';


export async function edit_item(interaction, shop) {
  const row = await newItemSelect(interaction, shop);
  const message = await interaction.reply({ content: '編集する商品を選択', components: [row], ephemeral: true });
  let res;

  try {
    res = await message.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id, time: 180000 });
  } catch (error) {
    await interaction.editReply({ content: 'タイムアウトしました。', ephemeral: true });
    return;
  }

  const itemName = res.values[0];

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

  const index = shop.item.findIndex(element => element.name === inputName);

  if (index === -1) {
    const embed = new discord.EmbedBuilder()
      .setColor('Red')
      .setTitle(`${inputName} は存在しません。`);

    await interaction.reply({ embeds: [embed], ephemeral: true });
    return;
  }

  shop.item[index].name = inputName;
  shop.item[index].price = inputPrice;

  const embed = new discord.EmbedBuilder()
    .setColor('Green')
    .setTitle('商品追加')
    .setDescription(`商品名:${inputName}\n値段:${inputPrice}`);
  
  await interaction.reply({ embeds: [embed], ephemeral: true });
};