import discord from 'discord.js';

const commands = [
  './verify.js'
];


const data = new discord.SlashCommandBuilder()
  .setName('backup')
  .setDescription('backup')
  .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator);


(async () => {
  for (const element of commands) {
    const command = (await import(`./${element}`)).default;

    data.addSubcommand(subcommand => command.data);
  }
})();


console.log(data)

import verify from './verify.js';
verify.type = 1;
commands.verify = verify
data.options.push(verify);





console.log(
  new discord.SlashCommandBuilder()
    .setName('hello')
    .setDescription('Hi Command')

  .addSubcommand( subcommand => subcommand
    .setName('subc')
  )
)


export default {
  data: data,
  async execute(interaction) {
    const command = interaction.options.getSubcommand();

    commands[command].execute(interaction);
  }
}