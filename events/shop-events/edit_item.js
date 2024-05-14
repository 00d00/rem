import discord from 'discord.js';
import newModal from './newModal.js';
import newItemSelect from './newItemSelect.js';


export async function edit_item(interaction, shop) {
const row = newItemSelect(interaction, shop);
const message = await interaction.reply({ content: 'Components', components: [row], ephemeral: true });

try {
    let stringInteraction = await message.awaitMessageComponent({ componentType: discord.ComponentType.StringSelect, filter: i => i.user.id === interaction.user.id, time: 180000 });
    const value = stringInteraction.values[0];
    stringInteraction.reply({
        content: `${value} wo sentaku shi te yattaze!`,
        ephemeral: true
    });
} catch (err) {
    console.error(err);
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