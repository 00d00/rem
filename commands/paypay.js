import discord from 'discord.js';
import { PayPay, PayPayStatus } from 'paypax';
import fs from 'fs/promises';
import crypt from '../modules/crypt.js';


function ErrorEmbed(interaction, message) {
  return new discord.EmbedBuilder()
    .setColor('Red')
    .setTitle(`paypay-${interaction.options.getSubcommand()}`)
    .setDescription(message)
}

const CreateError = message => ({ success: false, data: message });

async function login(interaction, tokenLogin = true) {
  try {
    const content = await fs.readFile(`./paypay/${interaction.user.id}.json`, 'utf-8');
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


    await fs.writeFile(`./paypay/${interaction.user.id}.json`, JSON.stringify(data, null, 2), 'utf-8');

    const balance = await paypay.getBalance();
    if (!balance.success) return await login(interaction, false);

    return { status: true, data: paypay };

  } catch (error) {
    return CreateError('まだログインされていません。');
  }
}



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

      if (!balance.success) {
        const loginResult = await login(interaction, false);

        paypay = loginResult.data;
        console.log(loginResult);
      }

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
        console.log(e)
        const error = new discord.EmbedBuilder()
          .setColor('Red')
          .setTitle('paypay-accept')
          .setDescription('リンクが無効です。');

        await interaction.followUp({ embeds: [error], ephemeral: true });
        return;
      }

      try {
        await paypay.receiveLink(url);

        const embed = new discord.EmbedBuilder()
          .setColor('Blue')
          .setTitle('paypay-accept')
          .addFields(
            { name: '金額', value: linkData.amount.toString() },
            { name: 'オーダーID', value: linkData.orderId },
            { name: '送金者', value: linkData.sender_name }
          )

        await interaction.followUp({ embeds: [embed] });
      } catch (e) {
        console.log(e)
        const error = new discord.EmbedBuilder()
          .setColor('Red')
          .setTitle('paypay-accept')
          .setDescription('リンクが使用済みです。');

        await interaction.followUp({ embeds: [error], ephemeral: true });
        return;
      }
    }

  }
};