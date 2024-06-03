import discord from 'discord.js';

const commands = [];


const data = new discord.SlashCommandBuilder()
  .setName('backup')
  .setDescription('backup')


commands.forEach(async (element) => {
  const command = (await import(`filePath`));
});



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