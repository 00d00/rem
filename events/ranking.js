import discord from 'discord.js';

export default {
  name: discord.Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.customId === 'ranking-back') {
      
    } else if (interaction.customId === 'ranking-next') {
      
    }
  }
}