import discord from 'discord.js';

function UUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 3 | 8);
    return v.toString(16);
  });
}

export default async function(interaction, shop, select) {
  const randomId = UUID();

  const menu = new discord[`${select}SelectMenuBuilder`]()
    .setCustomId(randomId)
    .setPlaceholder(`${select}を選択`);

  const row = new discord.ActionRowBuilder()
    .addComponents(menu);

  const message = await interaction.reply({ components: [row], ephemeral: true });

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      interaction.client.off('interactionCreate', onFunc);
      reject(new Error('タイムアウトしました'));
    }, 60000);

    async function onFunc(i) {
      if (i.customId !== randomId) return;
      clearTimeout(timeout);
      interaction.client.off('interactionCreate', onFunc);
      resolve(i);
    }

    interaction.client.on('interactionCreate', onFunc);
  });
};