import discord from 'discord.js';


const subCommands = [];

const data = new discord.SlashCommandBuilder()
  .setName('name')
  .setDescription('name commands');

data.addSubcommand(command => command
  .setName('login')
      .setDescription('PayPayにログイン')
      .addStringOption(option =>option
        .setName('phone_number')
        .setDescription('電話番号')
        .setRequired(true)
      )
      .addStringOption(option =>option
        .setName('password')
        .setDescription('パスワード')
        .setRequired(true)
      )
    )

export default {
  data: data
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator)
  ,
  async execute(interaction) {
  }
}