import discord from 'discord.js';
import fs from 'fs/promises';

import {
  add_item,
  edit_item
} from './shop-events/index.js';

import * as shopEvents from './shop-events/index.js';

// add_item
// edit_item
// delete_item
// restock
// deplete
// stock_check
// set_vouch
// set_buyer
// edit_shop
// delete_shop

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


    shopEvents[button]
      ? await shopEvents[button](interaction, shop)
      : await interaction.reply({ content: '作成中!', ephemeral: true });
    console.log(shop)

    json[name] = shop;
    await fs.writeFile(`./shop/${interaction.user.id}.json`, JSON.stringify(json, null, 2), 'utf-8');
  }
}