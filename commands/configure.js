import discord from 'discord.js';
import fs from 'fs/promises';


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


  }
};
