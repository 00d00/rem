import discord from 'discord.js';
import newModal from './newModal.js';
import newItemSelect from './newItemSelect.js';


export async function restock(interaction, shop) {
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

  const modal = newModal({
    id: 'modal',
    title: '在庫追加',
    input: [
      {
        label: '在庫(改行区切り)',
        id: 'stock',
        style: discord.TextInputStyle.Paragraph
      }
    ]
  });

  await i.showModal(modal);
  let response;

  try {
    response = await i.awaitModalSubmit({ time: 180000 });
  } catch (error) {
    await interaction.editReply({ content: 'タイムアウトしました。', components: [] });
    return;
  }

  const stock = response.fields.getTextInputValue('stock');
  shop.item[index].stock.push(...stock.split('\n'));

  const data = shop.item[index].stock.join('\n');
  const buffer = Buffer.from(data, 'utf-8');
  const file = new discord.AttachmentBuilder(buffer, { name: 'stock.txt' });

  const embed = new discord.EmbedBuilder()
    .setColor('Green')
    .setTitle('在庫追加')

  await response.reply({ embeds: [embed], files: [file], ephemeral: true });
};