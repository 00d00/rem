import discord from 'discord.js';

export default {
  name: discord.Events.InteractionCreate,
  async execute(client, interaction) {
    if (!interaction.isButton) return;
    if (interaction.customId === 'shop_buy') {
      const channel = await interaction.guild.channels.create({
	      name: '📜-' + interaction.user.tag,
        parent: interaction.channel.parent,
	      type: discord.ChannelType.GuildText,
	      permissionOverwrites: [
		      {
			      id: interaction.guild.id,
	          deny: [
              discord.PermissionsBitField.Flags.ViewChannel
            ]
		      },
	  	    {
  			    id: interaction.user.id,
            allow: [
              discord.PermissionsBitField.Flags.ViewChannel,
              discord.PermissionsBitField.Flags.SendMessages,
              discord.PermissionsBitField.Flags.AttachFiles
            ]
		      }
	      ]
      });

      const embed = new discord.EmbedBuilder()
        .setColor(process.env.COLOR)
        .setTitle('チケット作成')
        .setDescription('チケットを作成しました！\n<#' + channel.id + '>');

      await interaction.reply({ embeds: [embed], ephemeral: true });


      const ticketEmbed = new discord.EmbedBuilder()
        .setColor(process.env.COLOR)
        .setTitle(interaction.message.embeds[0].title)
        .setDescription('スタッフが来るまでお待ち下さい');

      const button = new discord.ButtonBuilder()
        .setCustomId('close')
        .setLabel('閉じる🔒')
    	  .setStyle(discord.ButtonStyle.Primary);

      const ticketRow = new discord.ActionRowBuilder()
		    .addComponents(button);

      await channel.send({ embeds: [ticketEmbed], components: [ticketRow] });

      const msg = await channel.send('@everyone');
      await msg.delete();
    } else if (interaction.customId === 'close') {
      const embed = new discord.EmbedBuilder()
        .setColor(process.env.COLOR)
        .setTitle('チケット削除')
        .setDescription('チケットを削除します。');

      await interaction.reply({ embeds: [embed] });
      setTimeout(() => {
        interaction.channel.delete();
      }, 1000);
    }
  }
};