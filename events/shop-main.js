import discord from 'discord.js';
import fs from 'fs/promises';

import * as shopEvents from './shop-events/index.js';

export default {
  name: discord.Events.InteractionCreate,
  async execute(client, interaction) {
    if (!interaction.isButton()) return;
    const data = interaction.customId.split('-');

    if (data.length !== 2) return;

    const button = data[0];
    const name = data[1];

    if (!shopEvents[button]) return;

    const json = JSON.parse(await fs.readFile(`./shop/${interaction.user.id}.json`, 'utf-8'));
    const shop = json[name];

    const executed = shopEvents[button]
      ? await shopEvents[button](interaction, shop)
      : false;

    if (executed !== false) {
      json[name] = shop;
      await fs.writeFile(`./shop/${interaction.user.id}.json`, JSON.stringify(json, null, 2), 'utf-8');
    }
  }
}