import discord from "discord.js";
import { PayPay, PayPayStatus } from "paypax";
import fs from 'fs/promises';

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
      .setName('balance')
      .setDescription('PayPay残高を取得')
      .addStringOption((option) =>option
        .setName('uuid')
        .setDescription('UUID')
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

        await interaction.reply({ embeds: [embed] });
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
    } else if (command === 'balance') {

    }
  }
};
