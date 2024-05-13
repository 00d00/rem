import discord from 'discord.js';
import fs from 'fs/promises';

import {} from './shop-events/index.js';

function newModal(modalData) {
  const modal = new discord.ModalBuilder()
    .setCustomId(modalData.id)
    .setTitle(modalData.title);
  
  const array = [];

  for (let i = 0; i < modalData.input.length; i++) {
    const data = modalData.input[i];

    const textInput = new discord.TextInputBuilder()
      .setLabel(data.label)
      .setCustomId(data.id)
      .setStyle(data.style)
      .setRequired(true);

    array.push(
      new discord.ActionRowBuilder().setComponents(textInput)
    );
  }

  modal.setComponents(array);
  return modal;
};



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

    if (button === 'add_item') {
      
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
    await fs.writeFile(`./shop/${interaction.user.id}.json`, JSON.stringify(json, null, 2), 'utf-8');
  }
}