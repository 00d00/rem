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
  data: new discord.SlashCommandBuilder()
    .setName('configure')
    .setDescription('configure for admin')
  ,
  async execute(interaction) {
		await interaction.deferReply();
		setTimeout(async () => {
      		await interaction.followUp('<:CA:1222420131309682728>');
    }, 5000);
  }
};