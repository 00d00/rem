import discord from 'discord.js';
import { PayPay, PayPayStatus } from 'paypax';
import fs from 'fs/promises';
import crypt from '../modules/crypt.js';

export default {
  data: new discord.SlashCommandBuilder()
    .setName('paypay')
    .setDescription('paypay commands')

    .addSubcommand(command => command
      .setName('login')
      .setDescription('PayPayにログイン')
      .addStringOption(option => option
        .setName('phone_number')
        .setDescription('電話番号')
        .setRequired(true)
      )
      .addStringOption(option => option
        .setName('password')
        .setDescription('パスワード')
        .setRequired(true)
      )
    )

    .addSubcommand(command => command
      .setName('balance')
      .setDescription('PayPay残高を取得')
    )

    .addSubcommand(command => command
      .setName('accept')
      .setDescription('PayPayリンクを受け取る')
      .addStringOption(option => option
        .setName('url')
        .setDescription('URL')
        .setRequired(true)
      )
    )
  ,
  async execute(interaction) {
    if (interaction.user.id !== '1097780939368714310') {
      await interaction.reply({ content: 'Admin Only', ephemeral: true });
      return;
    }

    const command = interaction.options.getSubcommand();

    if (command === 'login') {
      try {
        
      } catch(e) {
        // 握りつぶす
      }

      const paypay = new PayPay(interaction.options.getString('phone_number'), interaction.options.getString('password'));
      const result = await paypay.login();

      if (result.status === PayPayStatus.LoginIncorrectPassOrPhone) {

        const embed = new discord.EmbedBuilder()
          .setColor('Red')
          .setTitle('paypay-login')
          .setDescription('電話番号またはメールアドレスが間違っています。');

        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;

      } else if (result.status === PayPayStatus.LoginNeedOTP) {

        await fs.writeFile(`./temp/${interaction.user.id}`, JSON.stringify(paypay));

        const modal = new discord.ModalBuilder()
          .setCustomId('paypay_otp')
          .setTitle('PayPay OTP');

        const otpInput = new discord.TextInputBuilder()
          .setCustomId('otp')
          .setLabel('OTPを入力')
          .setMaxLength(4)
          .setMinLength(4)
          .setRequired(true)
          .setStyle(discord.TextInputStyle.Short);

        modal.addComponents(
          new discord.ActionRowBuilder().addComponents(otpInput)
        );

        await interaction.showModal(modal);
      }

    } else if (command === 'balance') {

      let content

      try {
        content = await fs.readFile(`./paypay/${interaction.user.id}`, 'utf-8');
      } catch (e) {
        const error = new discord.EmbedBuilder()
          .setColor('Red')
          .setTitle('paypay-info')
          .setDescription('まだログインされていません。\n/paypay loginでログインしてください。');

        interaction.reply({ embeds: [error], ephemeral: true });
        return;
      }

      let [phone, password, uuid] = content.split('.');

      phone = crypt.decrypt(phone);
      password = crypt.decrypt(password);
      uuid = crypt.decrypt(uuid);

      const paypay = new PayPay(phone, password);
      const result = await paypay.login({ uuid: uuid });

      if (!result.status) {
        const error = new discord.EmbedBuilder()
          .setColor('Red')
          .setTitle('paypay-info')
          .setDescription('ログイン情報が変更されたためログインできませんでした。');

        interaction.reply({ embeds: [error], ephemeral: true });
        return;
      }

      const balance = await paypay.getBalance();

      const walletSummary = balance.raw.payload.walletSummary;
      const transferableBalance = walletSummary.transferableBalanceInfo.balance;
      const payoutableBalance = walletSummary.payoutableBalanceInfo.balance;

      const embed = new discord.EmbedBuilder()
        .setColor('Red')
        .setTitle('paypay-info')
        .setDescription(
          `PayPay残高: **${transferableBalance.toLocaleString()}円**` + '\n' +
          `PayPayマネー: **${payoutableBalance.toLocaleString()}円**` + '\n' +
          `PayPayマネーライト: **${(transferableBalance - payoutableBalance).toLocaleString()}円**`
        )
        .setTimestamp()

      await interaction.reply({ embeds: [embed] });

    } else if (command === 'accept') {

      const url = interaction.options.getString('url');

      let content

      try {
        content = await fs.readFile(`./paypay/${interaction.user.id}`, 'utf-8');
      } catch (e) {
        const error = new discord.EmbedBuilder()
          .setColor('Red')
          .setTitle('paypay-info')
          .setDescription('まだログインされていません。\n/paypay loginでログインしてください。');

        await interaction.reply({ embeds: [error], ephemeral: true });
        return;
      }

      let [phone, password, uuid] = content.split('.');

      phone = crypt.decrypt(phone);
      password = crypt.decrypt(password);
      uuid = crypt.decrypt(uuid);

      const paypay = new PayPay(phone, password);
      const result = await paypay.login({ uuid: uuid });

      if (!result.status) {
        const error = new discord.EmbedBuilder()
          .setColor('Red')
          .setTitle('paypay-info')
          .setDescription('ログイン情報が変更されたためログインできませんでした。');

        await interaction.reply({ embeds: [error], ephemeral: true });
        return;
      }

      let get

      try {
        get = await paypay.getLink(url);
      } catch (e) {
        const error = new discord.EmbedBuilder()
          .setColor('Red')
          .setTitle('paypay-accept')
          .setDescription('リンクが無効です。');

        await interaction.reply({ embeds: [error], ephemeral: true });
        return;
      }

      try {
        await paypay.receiveLink(url);

        const embed = new discord.EmbedBuilder()
          .setColor('Blue')
          .setTitle('paypay-accept')
          .addFields(
            { name: '金額', value: get.amount.toString() },
            { name: 'オーダーID', value: get.orderId },
            { name: '送金者', value: get.sender_name }
          )

        await interaction.reply({ embeds: [embed] });
      } catch (e) {
        const error = new discord.EmbedBuilder()
          .setColor('Red')
          .setTitle('paypay-accept')
          .setDescription('リンクが使用済みです。');

        await interaction.reply({ embeds: [error], ephemeral: true });
        return;
      }
    }
  }
};