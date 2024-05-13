import discord from 'discord.js';

export default function newModal(modalData) {
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