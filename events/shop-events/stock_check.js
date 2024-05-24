import discord from 'discord.js';
import newModal from './newModal.js';
import newItemSelect from './newItemSelect.js';


export async function stock_check(interaction, shop) {
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

  const data = shop.item[index].stock.join('\n');
  const buffer = Buffer.from(data, 'utf-8');
  const file = new discord.AttachmentBuilder(buffer, { name: 'stock.txt' });

  const embed = new discord.EmbedBuilder()
    .setColor('Green')
    .setTitle('在庫確認')

  await i.reply({ embeds: [embed], files: [file], ephemeral: true });
};