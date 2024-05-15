import discord from 'discord.js';
import fs from 'fs/promises';

import {
  add_item,
  edit_item
} from './shop-events/index.js';




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

    if (button === 'edit_item') await edit_item(interaction, shop);

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