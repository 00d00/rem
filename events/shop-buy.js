import discord from 'discord.js';
import { PayPay, PayPayStatus } from 'paypax';
import fs from 'fs/promises';
import crypt from '../modules/crypt.js';
import newItemSelect from '../modules/newItemSelect.js';


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
    if (!interaction.isButton) return;
    if (!interaction.customId.startsWith('shop_buy-')) return;

    const args = interaction.customId.split('-');
    const command = args[0];
    const user = args[1];

    const result = await login(user);

    if (!result.status) {
      const embed = new discord.EmbedBuilder()
        .setColor('Red')
        .setTitle('失敗')
        .setDescription('PayPay連携が行われていません。管理者にお問い合わせください。');

      await interaction.reply({ embeds: [embed] });
      return;
    }

    const paypay = result.data;

    await interaction.reply(interaction.fetch)
  }
};