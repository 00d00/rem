import discord from 'discord.js';
import newModal from './newModal.js';
import newItemSelect from './newItemSelect.js';


export async function edit_item(interaction, shop) {
  const row = newItemSelect(interaction, shop);
  const message = await interaction.reply({ content: 'Components', components: [row], ephemeral: true });

const callback = async (i) => {
  if (i.user.id !== interaction.user.id) return;
  if (i.customId !== 'item_select') return;

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
    await i.followUp({ content: 'タイムアウトしました。', ephemeral: true });
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
    .setDescription(`商品名:${inputName}\n値段:${inputPrice}`);

  await response.reply({ embeds: [embed], ephemeral: true });
};

  interaction.client.on(discord.Events.InteractionCreate, callback);

  setTimeout(
    () => interaction.client.removeListener(discord.Events.InteractionCreate, callback),
    3 * 6 * 1000
  );
};