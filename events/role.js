import discord from 'discord.js';

export default {
  name: discord.Events.MessageReactionAdd,
  async execute(reaction, user) {
    if (user.id === process.env.CLIENT_ID) return;

    if (reaction.emoji.name === '1⃣') {
      reaction.message.channel.send(`${user.tag} が1⃣にリアクションしました！`);
    } else if (reaction.emoji.name === '2⃣') {
      reaction.message.channel.send(`${user.tag} が2⃣にリアクションしました！`);
    }
  }
}