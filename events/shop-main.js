import discord from 'discord.js';
import fs from 'fs/promises';

import { add_item, edit_item } from './shop-events/index.js';
import newItemSelect from './shop-events/newItemSelect.js';



export default {
  name: discord.Events.InteractionCreate,
  async execute(client, interaction) {
    if (!interaction.isButton()) return;

    const data = interaction.customId.split('-');

    if (data.length !== 2) return;

    const button = data[0];
    const name = data[1];

    const json = JSON.parse(await fs.readFile(`./shop/${interaction.user.id}.json`, 'utf-8'));
    const shop = json[name];

    if (button === 'add_item') await add_item(interaction, shop);



    if (button === 'edit_item') {
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
    await fs.writeFile(`./shop/${interaction.user.id}.json`, JSON.stringify(json, null, 2), 'utf-8');
  }
}