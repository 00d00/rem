import discord from 'discord.js';
import newModal from './newModal.js';
import newItemSelect from './newItemSelect.js';


export async function edit_item(interaction, shop) {
  const row = newItemSelect(interaction, shop);
  const message = await interaction.reply({ content: '編集する商品を選択', components: [row], ephemeral: true });

  const collector = message.createMessageComponentCollector({
    componentType: discord.ComponentType.StringSelect,
    time: 180000,
  });

  collector.on("collect", async i => {

    const itemName = i.values[0];

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

    await i.showModal(modal);

    const response = await i.awaitModalSubmit({
      time: 180000,
      filter: i => i.user.id === interaction.user.id,
    }).then(async int => {
      const inputName = int.fields.getTextInputValue('name');
      const inputPrice = int.fields.getTextInputValue('price');

      const index = shop.item.findIndex(element => element.name === inputName);

      if (index === -1) {
        const embed = new discord.EmbedBuilder()
          .setColor('Red')
          .setTitle(`${inputName} は存在しません。`);

        await int.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      shop.item[index].name = inputName;
      shop.item[index].price = inputPrice;

      const embed = new discord.EmbedBuilder()
        .setColor('Green')
        .setTitle('商品追加')
        .setDescription(`商品名:${inputName}\n値段:${inputPrice}`);
  
      await int.reply({ embeds: [embed], ephemeral: true });
    }).catch(error => {
      console.error(error)
      return null
    })
  })
};