const discord = require('discord.js');

module.exports = {
  name: discord.Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isButton()) return;
    
  },
};