import discord from 'discord.js';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const dirPath = dirname(fileURLToPath(import.meta.url));
const commands = await fs.readdir(dirPath);

const data = new discord.SlashCommandBuilder()
  .setName('backup')
  .setDescription('backup')
  .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator);

export default async () => {
  const executions = {};

  for (const element of commands) {
    if (element === 'index.js') continue;

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