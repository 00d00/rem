import discord from 'discord.js';
import fs from 'fs/promises';


const newModal = modalData => {
  const modal = new discord.ModalBuilder()
    .setCustomId(modalData.id)
    .setTitle(modalData.title);
  
  const array = [];

  for (let i = 0; i < modalData.input.length; i++) {
    const data = modalData.input[i];

    const TextInput = new discord.TextInputBuilder()
      .setLabel(data.label)
      .setCustomId(data.id)
      .setStyle(data.style)
      .setRequired(true)
    const ActionRow = new discord.ActionRowBuilder().setComponents(TextInput);
    array.push(ActionRow);
  }

  modal.setComponents(array);
  return modal;
};



export default {
  name: discord.Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isButton()) return;

    const data = interaction.customId.split('-');

    if (data.length !== 2) return;

    const button = data[0];
    const name = data[1];

    const json = JSON.parse(await fs.readFile(`./shop/${interaction.user.id}.json`, 'utf-8'));
    const shop = json[name];

    if (button === 'add_item') {
      const modal = newModal({
        id: 'modal',
        title: '商品の追加',
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
        await interaction.followUp({ content: `入力遅えよ！！ばーか！！`, ephemeral: true });
        return;
      }

      const inputName = response.fields.getTextInputValue("name");
      const inputPrice = response.fields.getTextInputValue("price");

      shop.item.push({
        name: inputName,
        price: inputPrice
      });

      const embed = new discord.EmbedBuilder()
        .setTitle('商品追加完了')
        .setDescription(`商品名:${inputName}\n値段:${inputPrice}`)
        .setColor('Green');

      await interaction.followUp({ embeds: [embed], ephemeral: true });
      await response.reply({ embeds: [embed], ephemeral: true });
    }


    if (button === 'edit_item') {
    }

    if (button === 'delete_item') {
    }

    if (button === 'restock') {
    }

    if (button === 'takeout') {
    }

    if (button === 'confirm') {
    }

    if (button === 'vouch') {
    }

    if (button === 'buyer') {
    }

    if (button === 'edit_shop') {
    }

    if (button === 'delete_shop') {
    }

    json[name] = shop;
    await fs.writeFile(`./shop/${interaction.user.id}.json`, 'utf-8');
  }
}