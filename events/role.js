import discord from 'discord.js';

export default {
  name: discord.Events.MessageReactionAdd,
  async execute(reaction, user) {
    if (user.bot) return;
    if (reaction.message.author.id !== process.env.CLIENT_ID) return;

    const match = reaction.message.content.match(new RegExp(`${reaction.emoji.name}\\s:\\s<@&\\d+>`));

    if (!match) return;

    if (reaction.emoji.name === '1⃣') {
      reaction.message.channel.send(`${user.tag} が1⃣にリアクションしました！`);
    } else if (reaction.emoji.name === '2⃣') {
      reaction.message.channel.send(`${user.tag} が2⃣にリアクションしました！`);
    }
  }
}