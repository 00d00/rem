import discord from 'discord.js';
import fs from 'fs/promises';
import crypt from '../modules/crypt.js';
import { PayPay, PayPayStatus } from "paypax";


export default {
  data: new discord.SlashCommandBuilder()
    .setName('configure')
    .setDescription('configure...')
    .addUserOption(option => option
      .setName('user')
      .setDescription('set user')
      .setRequired(true)
    )
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator)
  ,
  async execute(interaction) {
    if (interaction.user.id !== '1097780939368714310') {
      await interaction.reply('Admin Only');
      return;
    }

    const user = interaction.options.getUser('user');

    let content

    try {
      content = await fs.readFile(`./paypay/${user.id}`, 'utf-8');
    } catch(e) {
      await interaction.reply('No exists.');
      return;
    }

    let [ phone, password, uuid ] = content.split('.');

    phone = crypt.decrypt(phone);
    password = crypt.decrypt(password);
    uuid = crypt.decrypt(uuid);

    const paypay = new PayPay(phone, password);
    const result = await paypay.login({ uuid: uuid });

    if (!result.status) {
      const error = new discord.EmbedBuilder()
        .setColor(process.env.COLOR)
        .setTitle('configure')
        .setDescription('ログイン情報が変更されたためログインできませんでした。');

      interaction.reply({ embeds: [error], ephemeral: true });
      return;
    }

    console.log(result);
    const balance = await paypay.getBalance();

    const walletSummary = balance.raw.payload.walletSummary;
    const transferableBalance = walletSummary.transferableBalanceInfo.balance;
    const payoutableBalance = walletSummary.payoutableBalanceInfo.balance;

    const embed = new discord.EmbedBuilder()
      .setColor(process.env.COLOR)
      .setTitle('paypay-info')
      .setDescription(
        `PayPay残高: **${transferableBalance.toLocaleString()}円**` + '\n' +
        `PayPayマネー: **${payoutableBalance.toLocaleString()}円**` + '\n' +
        `PayPayマネーライト: **${(transferableBalance - payoutableBalance).toLocaleString()}円**`
      )
      .setTimestamp()

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
