import discord from 'discord.js';

const commands = [
  './verify.js'
];

const data = new discord.SlashCommandBuilder()
  .setName('backup')
  .setDescription('backup')
  .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator);

const initializeCommands = async () => {
  const executions = {};

  for (const element of commands) {
    const command = (await import(`./${element}`)).default;
    data.addSubcommand(subcommand => command.data);
    executions[command.name]
  }

  const execute = (interaction) => {
    
  };

  return { data: data, execute };
};

export default initializeCommands;