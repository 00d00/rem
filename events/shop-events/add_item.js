import discord from 'discord.js';

export async function add_item(interaction, shop) {
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

      await interaction.showModal(modal);
      let response;

      try {
        response = await interaction.awaitModalSubmit({ time: 180000 });
      } catch (error) {
        await interaction.followUp({ content: 'タイムアウトしました。', ephemeral: true });
        return;
      }

      const inputName = response.fields.getTextInputValue("name");
      const inputPrice = response.fields.getTextInputValue("price");

      shop.item.push({
        name: inputName,
        price: inputPrice
      });

      const embed = new discord.EmbedBuilder()
        .setColor('Green')
        .setTitle('商品追加')
        .setDescription(`商品名:${inputName}\n値段:${inputPrice}`);

      await response.reply({ embeds: [embed], ephemeral: true });
}