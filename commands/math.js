import discord from 'discord.js';
import { PayPay, PayPayStatus } from 'paypax';
import fs from 'fs/promises';
import crypt from '../modules/crypt.js';


export default {
  data: new discord.SlashCommandBuilder()
    .setName('paypay')
    .setDescription('paypay commands')

    .addSubcommand(command => command
      .setName('play')
      .setDescription('音楽を再生します')
      .addStringOption(option => option
        .setName('keyword')
        .setDescription('キーワードまたはURL')
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

    .addSubcommand(command => command
      .setName('send')
      .setDescription('送金リンクを作成')
      .addIntegerOption(option => option
        .setName('amount')
        .setDescription('金額')
        .setRequired(true)
      )
    )

    .addSubcommand(command => command
      .setName('history')
      .setDescription('取引履歴を取得')
    )
  ,
  async execute(interaction) {
    const command = interaction.options.getSubcommand();

    if (command === 'login') {
      const paypay = new PayPay(interaction.options.getString('phone_number'), interaction.options.getString('password'));
      const result = await paypay.login();

      if (result.status === PayPayStatus.LoginIncorrectPassOrPhone) {

        const embed = ErrorEmbed(interaction, '電話番号またはメールアドレスが間違っています。');

        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;

      } else if (result.status === PayPayStatus.LoginNeedOTP) {

        await fs.writeFile(`./temp/${interaction.user.id}`, JSON.stringify(paypay, null, 2));

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

      } else if (result.status === PayPayStatus.LoginSuccess) {

        const embed = new discord.EmbedBuilder()
          .setColor('Blue')
          .setTitle('paypay-login')
          .setDescription('ログインに成功しました！');

        await interaction.reply({ embeds: [embed], ephemeral: true });

      }
    }






    if (command === 'balance') {
      const loginResult = await login(interaction);

      if (!loginResult.status) {
        const embed = ErrorEmbed(interaction, loginResult.data);
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      console.log(loginResult);

      let paypay
      paypay = loginResult.data;

      let balance;
      balance = await paypay.getBalance();

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
    }






    if (command === 'accept') {
      await interaction.deferReply();

      const url = interaction.options.getString('url');

      const loginResult = await login(interaction);

      if (!loginResult.status) {
        const embed = ErrorEmbed(interaction, loginResult.data);
        await interaction.followUp({ embeds: [embed], ephemeral: true });
        return;
      }

      const paypay = loginResult.data;
      let linkData

      try {
        linkData = await paypay.getLink(url);
      } catch (e) {
        const error = new discord.EmbedBuilder()
          .setColor('Red')
          .setTitle('paypay-accept')
          .setDescription('リンクが無効です。');

        await interaction.followUp({ embeds: [error], ephemeral: true });
        return;
      }

      const res = await paypay.receiveLink(url);
  
      if (!res.success) {
        const embed = new discord.EmbedBuilder()
          .setColor('Red')
          .setTitle('paypay-accept')
          .setDescription('リンクが使用済みです。');

        await interaction.followUp({ embeds: [embed], ephemeral: true });
        return;
      }

      const embed = new discord.EmbedBuilder()
        .setColor('Blue')
        .setTitle('paypay-accept')
        .addFields(
          { name: '金額', value: linkData.amount.toString() },
          { name: 'オーダーID', value: linkData.orderId },
          { name: '送金者', value: linkData.sender_name }
        );

      await interaction.followUp({ embeds: [embed] });
    }

  }
};