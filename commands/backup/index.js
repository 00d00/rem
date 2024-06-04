import discord from 'discord.js';

const commands = [
  './verify.js'
];

const data = new discord.SlashCommandBuilder()
  .setName('backup')
  .setDescription('backup')
  .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator);

export default async () => {
  const executions = {};

  for (const element of commands) {
    const command = (await import(`./${element}`)).default;
    data.addSubcommand(subcommand => command.data);
    executions[command.data.name] = command.execute;
  }

  const execute = async (interaction) => {
    const command = interaction.options.getSubcommand();

    if (executions[command]) {
      await executions[command](interaction);
    }
  };

  return { data: data, execute };
};