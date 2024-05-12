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
    array.push(TextInput);
  }

  const ActionRow = new discord.ActionRowBuilder().setComponents(array);
  modal.setComponents(ActionRow);
  console.log(JSON.stringify(modal, null, 2))
  return modal;
};

export default {
  data: new discord.SlashCommandBuilder()
    .setName('configure')
    .setDescription('configure for admin')
  ,
  async execute(interaction) {
    if (interaction.user.id !== '1097780939368714310') {
      await interaction.reply('Admin Only');
      return;
    }

      const modal = newModal({
        id: 'ちょっと調べてくる',
        title: 'modal-title',
        input: [
          {
            label: 'input-label1',
            id: 'input-id1',
            style: discord.TextInputStyle.Short
          },
          {
            label: 'input-label2',
            id: 'input-id2',
            style: discord.TextInputStyle.Paragraph,
          }
        ]
      });

      const res = await interaction.showModal(modal);

  }
};