import discord from 'discord.js';

export default {
  name: discord.Events.InteractionCreate,
  async execute(client, interaction) {
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith('ticket-')) return;

    const args = interaction.customId.split('-');
    const command = args[0];
    const data = JSON.parse(args[1]);

    if (data.role) {
      //console.log(data.role)
      //data.role = await interaction.guild.roles.fetch(data.role);
      //console.log(data.role)
    }

    console.log(data.category)
    if (data.category) {
      data.category = await interaction.guild.channels.fetch(data.category);
    }

    const permission = [
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
    ];

    if (data.role) {
      permission[2] = {
        id: data.role,
        allow: [
          discord.PermissionsBitField.Flags.ViewChannel,
          discord.PermissionsBitField.Flags.SendMessages,
          discord.PermissionsBitField.Flags.AttachFiles
        ]
      }
    }

    const channel = await interaction.guild.channels.create({
	    name: `📜-${interaction.user.tag}`,
      parent: data.category ?? interaction.channel.parent,
	    type: discord.ChannelType.GuildText,
	    permissionOverwrites: permission
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

      //const msg = await channel.send('@everyone');
      //await msg.delete();
  }
};