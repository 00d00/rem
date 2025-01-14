import discord from 'discord.js';
import { PayPay, PayPayStatus } from 'paypax';
import fs from 'fs/promises';
import crypt from '../modules/crypt.js';
import newItemSelect from '../modules/newItemSelect.js';
import newModal from '../modules/newModal.js';

const CreateError = message => ({ success: false, data: message });

async function login(user, tokenLogin = true) {
  try {
    const content = await fs.readFile(`./paypay/${user}.json`, 'utf-8');
    const data = JSON.parse(content);

    let { phone, password, uuid, token } = data;

    phone = crypt.decrypt(phone);
    password = crypt.decrypt(password);
    uuid = crypt.decrypt(uuid);
    token = crypt.decrypt(token);

    const paypay = new PayPay(phone, password);
    const result = await paypay.login({ uuid: uuid, token: tokenLogin ? token : undefined });

    if (!result.status) {
      return CreateError('ログイン情報が変更されたためログインできませんでした。' );
    }

    data.token = crypt.encrypt(paypay.token);


    await fs.writeFile(`./paypay/${user}.json`, JSON.stringify(data, null, 2), 'utf-8');

    const balance = await paypay.getBalance();
    if (!balance.success) return await login(user, false);

    return { status: true, data: paypay };

  } catch (error) {
    return CreateError('まだログインされていません。');
  }
}

export default {
  name: discord.Events.InteractionCreate,
  async execute(client, interaction) {
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith('shop_buy-')) return;

    const args = interaction.customId.split('-');
    const command = args[0];
    const data = JSON.parse(args[1]);
    const { user, title } = data;

    const result = await login(data.user);

    if (!result.status) {
      const embed = new discord.EmbedBuilder()
        .setColor('Red')
        .setTitle('失敗')
        .setDescription('PayPay連携が行われていません。管理者にお問い合わせください。');

      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const paypay = result.data;

    let json;
    let shop;

    try {
      json = JSON.parse(await fs.readFile(`./shop/${user}.json`));
      shop = json[title];
    } catch (error) {
      const embed = new discord.EmbedBuilder()
        .setColor('Red')
        .setTitle('失敗')
        .setDescription('不明なshopです。管理者にお問い合わせください。');

      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    let i;

    try {
      i = await newItemSelect(interaction, shop);
    } catch (error) {
      const embed = new discord.EmbedBuilder()
        .setColor('Red')
        .setTitle('失敗')
        .setDescription('タイムアウトしました。');

      interaction.editReply({ embeds: [embed], components: [] });
      return;
    }

    const itemName = i.values[0];
    const index = shop.item.findIndex(element => element.name === itemName);
    const item = shop.item[index];

    const modal = newModal({
      id: 'modal',
      title: '商品購入',
      input: [
        {
          label: '購入する個数',
          id: 'count',
          style: discord.TextInputStyle.Short
        },
        {
          label: 'PayPayリンク',
          id: 'url',
          style: discord.TextInputStyle.Short
        }
      ]
    });

    await i.showModal(modal);
    let response;

    try {
      response = await interaction.awaitModalSubmit({ time: 180000 });
    } catch (error) {
      await interaction.followUp({ content: 'タイムアウトしました。', ephemeral: true });
      return;
    }

    const count = response.fields.getTextInputValue('count');
    const url = response.fields.getTextInputValue('url');
    const price = item.price * count;

    if (count > item.stock.length) {
      const embed = new discord.EmbedBuilder()
        .setColor('Red')
        .setTitle('shop')
        .setDescription('在庫が足りません。');

      await response.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (!price) {
      const embed = new discord.EmbedBuilder()
        .setColor('Red')
        .setTitle('shop')
        .setDescription('入力が無効です。');

      await response.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    let linkData

    try {
      linkData = await paypay.getLink(url);
    } catch (error) {
      const embed = new discord.EmbedBuilder()
        .setColor('Red')
        .setTitle('shop')
        .setDescription('リンクが無効です。');

      await response.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (linkData.amount < price) {
      const embed = new discord.EmbedBuilder()
        .setColor('Red')
        .setTitle('shop')
        .setDescription('金額が足りません。');

      await response.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const res = await paypay.receiveLink(url);
    console.log(res)
  
    if (!res.success) {
      const embed = new discord.EmbedBuilder()
        .setColor('Red')
        .setTitle('paypay-accept')
        .setDescription('リンクが使用済みです。');

      await response.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (item.infinity_stock) {
      let selectedIndexes = [];
      let selectedElements = [];

      while (selectedIndexes.length < count) {
        let randomIndex = Math.floor(Math.random() * item.stock.length);

        if (!selectedIndexes.includes(randomIndex)) {
          selectedIndexes.push(randomIndex);
          selectedElements.push(item.stock[randomIndex]);
        }
      }

      const buffer = Buffer.from(selectedElements.join('\n'), 'utf-8');
      const file = new discord.AttachmentBuilder(buffer, { name: 'stock.txt' });

      const embed = new discord.EmbedBuilder()
        .setColor('Green')
        .setTitle('購入完了')
        .setDescription('商品を添付しました。\n保存してください。');

      await response.reply({ embeds: [embed], files: [file], ephemeral: true });
    } else {
      const removed = item.stock.splice(0, count);

      const buffer = Buffer.from(removed.join('\n'), 'utf-8');
      const file = new discord.AttachmentBuilder(buffer, { name: 'stock.txt' });

      const embed = new discord.EmbedBuilder()
        .setColor('Green')
        .setTitle('購入完了')
        .setDescription('商品を添付しました。\n保存してください。');

      await response.reply({ embeds: [embed], files: [file], ephemeral: true });
    }

    if (shop.vouch) {
      const channel = client.channels.cache.get(shop.vouch);

      if (channel) {
        const embed = new discord.EmbedBuilder()
          .setColor('Blue')
          .setTitle('購入ログ')
          .setDescription(
`<@${interaction.user.id}>

**購入内容** : ${item.name}
**値段** : ${price}
**購入数** : ${count}`
          )
          .setThumbnail(interaction.user.avatarURL())
          .setTimestamp();

        await channel.send({ embeds: [embed] });
      } else {
        shop.vouch = null;
      }
    }


    if (shop.buyer) {
      const member = interaction.guild.members.cache.get(interaction.user.id);
      const role = interaction.guild.roles.cache.get(shop.buyer);

      if (role) {
        await member.roles.add(role);
      } else {
        shop.buyer = null;
      }
    }

    json[title] = shop;
    await fs.writeFile(`./shop/${user}.json`, JSON.stringify(json, null, 2), 'utf-8');
  }
};