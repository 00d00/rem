import discord from 'discord.js';
import newModal from './newModal.js';
import newCustomMenu from './newCustomMenu.js';


export async function set_buyer(interaction, shop) {
  const i = await newCustomMenu(interaction, shop, 'Role');

  const role = i.roles.get(i.values[0]);

  shop.buyer = role.id;

  const embed = new discord.EmbedBuilder()
    .setColor('Green')
    .setTitle('購入者ロール変更')
    .setDescription(`購入者ロールを<@&${role.id}>に変更しました。`);

  await i.reply({ embeds: [embed], ephemeral: true });
};