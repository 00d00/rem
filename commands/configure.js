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
    if (interaction.user.id !== '1097780939368714310') {
      await interaction.reply('Admin Only');
      return;
    }

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
          },
          //{
          //  label: '無限在庫(y=yes, n=no)',
          //  id: 'infinity', // 面白い・天才
          //  style: discord.TextInputStyle.Short
          //}
        ]
      });

      const res = await interaction.showModal(modal);
      let response;

      try {
        response = await res.awaitMessageComponent({ time: 180000 });
      } catch (error) {
        console.log(error)
        await interaction.followUp({ content: `入力遅えよ！！ばーか！！`, ephemeral: true }); // 天才！！
        return;
      }


      const inputName = interaction.fields.getTextInputValue("name");
      const inputPrice = interaction.fields.getTextInputValue("price");
      // let inputInfinityStock = interaction.fields.getTextInputValue("infinity");

      /*
      if (inputInfinityStock === 'y') {
        inputInfinityStock = true;
      } else if (inputInfinityStock === 'n') {
        inputInfinityStock = false;
      } else {
        await interaction.reply({ content: `${inputInfinityStock}ってなんだよ！！ばーか！！`, ephemeral: true }); // 天才！！
        return;
      }
      */


//在庫を無限にするか:${inputInfinityStock ? "YES" : "NO"}
      // 埋め込み
      const embed = new discord.EmbedBuilder()
        .setTitle('商品追加完了|complete')
        .setDescription(`商品名:${inputName}\n値段:${inputPrice}`)
        .setColor("Green")

      await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};