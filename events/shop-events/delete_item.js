import discord from 'discord.js';
import newModal from './newModal.js';


export async function add_item(interaction, shop) {
  const modal = newModal({
    id: 'modal',
    title: '商品削除',
    input: [
      {
        label: '削除する商品名',
        id: 'name',
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

  const inputName = response.fields.getTextInputValue("name");

  const index = shop.item.findIndex(element => element.name === inputName)

  if (index === -1) {
    await response.reply({ content: '商品が見つかりませんでした。', ephemeral: true });
    return;
  }

  shop.item.splice(index, 1);

  const embed = new discord.EmbedBuilder()
    .setColor('Green')
    .setTitle('商品削除')
    .setDescription(`${inputName} を削除しました。`);

  await response.reply({ embeds: [embed], ephemeral: true });
};