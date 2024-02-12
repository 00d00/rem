import discord from "discord.js";
import { PayPay, PayPayStatus } from "paypax";
import fs from 'fs/promises';
import crypt from '../modules/crypt.js';

export default {
  data: new discord.SlashCommandBuilder()
    .setName("paypay")
    .setDescription("paypay commands")

    .addSubcommand((command) => command
      .setName('login')
      .setDescription('PayPayにログイン')
      .addStringOption((option) =>option
        .setName('phone_number')
        .setDescription('電話番号')
        .setRequired(true)
      )
      .addStringOption((option) =>option
        .setName('password')
        .setDescription('パスワード')
        .setRequired(true)
      )
    )

    .addSubcommand((command) => command
      .setName('info')
      .setDescription('PayPay情報を取得')
    )

    .addSubcommand((command) => command
      .setName('accept')
      .setDescription('PayPayリンクを受け取る')
      .addStringOption((option) =>option
        .setName('url')
        .setDescription('URL')
        .setRequired(true)
      )
    )
  ,
  async execute(interaction) {

    if (interaction.user.id !== '1097780939368714310') {
      interaction.reply({ content: '作成中', ephemeral: true });
      return;
    }

    const command = interaction.options.getSubcommand();

    if (command === 'login') {

      const paypay = new PayPay(interaction.options.getString('phone_number'), interaction.options.getString('password'));
      const result = await paypay.login();

      if (result.status === PayPayStatus.LoginIncorrectPassOrPhone) {

        const embed = new discord.EmbedBuilder()
          .setColor(process.env.COLOR)
          .setTitle('paypay-login')
          .setDescription('電話番号またはメールアドレスが間違っています。');

        await interaction.reply({ embeds: [embed], ephemeral: true});
        return;

      } else if (result.status === PayPayStatus.LoginNeedOTP) {

        await fs.writeFile(`./temp/${interaction.user.id}`, JSON.stringify(paypay));

        const modal = new discord.ModalBuilder()
          .setCustomId('paypay_otp')
          .setTitle('PayPay OTP');

        const otpInput = new discord.TextInputBuilder()
          .setCustomId('otp')
          .setLabel("OTPを入力")
        	.setMaxLength(4)
	        .setMinLength(4)
          .setRequired(true)
          .setStyle(discord.TextInputStyle.Short);

        modal.addComponents(
          new discord.ActionRowBuilder().addComponents(otpInput)
        );

        await interaction.showModal(modal);
      } else  {
        throw new Error(`未知のPayPayステータス: ${result.status}`);
      }

    } else if (command === 'info') {

      const content = await fs.readFile(`./paypay/${interaction.user.id}`, 'utf-8');
      let [ phone, password, uuid ] = content.split('.');

      phone = crypt.decrypt(phone);
      password = crypt.decrypt(password);
      uuid = crypt.decrypt(uuid);

      const paypay = new PayPay(phone, password);
      const result = await paypay.login({ uuid: uuid });

      if (!result.status) {
        const error = new discord.EmbedBuilder()
          .setColor(process.env.COLOR)
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
        .setColor(process.env.COLOR)
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

      const content = await fs.readFile(`./paypay/${interaction.user.id}`, 'utf-8');
      let [ phone, password, uuid ] = content.split('.');

      phone = crypt.decrypt(phone);
      password = crypt.decrypt(password);
      uuid = crypt.decrypt(uuid);

      const paypay = new PayPay(phone, password);
      const result = await paypay.login({ uuid: uuid });

      if (!result.status) {
        const error = new discord.EmbedBuilder()
          .setColor(process.env.COLOR)
          .setTitle('paypay-info')
          .setDescription('ログイン情報が変更されたためログインできませんでした。');

        interaction.reply({ embeds: [error], ephemeral: true });
        return;
      }

      const a = await paypay.receiveLink(url);
    }
  }
};
