import discord from "discord.js";

export default {
  data: new discord.SlashCommandBuilder()
    .setName("nuke")
    .setDescription("チャンネル履歴を削除")
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator)
  ,
  async execute(interaction) {
    const confirm = new discord.ButtonBuilder()
      .setCustomId("nuke_confirm")
      .setLabel("削除する")
      .setStyle(discord.ButtonStyle.Danger);

    const cancel = new discord.ButtonBuilder()
      .setCustomId("nuke_cancel")
      .setLabel("キャンセル")
      .setStyle(discord.ButtonStyle.Secondary);

    const row = new discord.ActionRowBuilder().addComponents(confirm, cancel);

    const embed = new discord.EmbedBuilder()
      .setTitle("nuke")
      .setDescription("本当にチャンネル履歴を削除しますか？");

    const res = await interaction.reply({ embeds: [embed], components: [row] });

    try {
      const confirmation = await res.awaitMessageComponent({
        filter: (i) => i.user.id === interaction.user.id,
        time: 60000,
      });

      if (confirmation.customId === "nuke_confirm") {
        const channel = await interaction.channel.clone();
        await channel.setPosition(interaction.channel.position);
        await interaction.channel.delete();

        const ad = new discord.ButtonBuilder()
          .setURL("https://discord.com/api/oauth2/authorize?client_id=1191234193099849838&permissions=8&scope=bot")
          .setLabel("Acesを招待")
          .setStyle(discord.ButtonStyle.Link);

        const row = new discord.ActionRowBuilder().addComponents(ad);

        const embed = new discord.EmbedBuilder()
          .setTitle("nuke")
          .setDescription(`<@${interaction.user.id}> が/nukeを実行しました。`);

        await channel.send({ embeds: [embed], components: [row] });

      } else if (confirmation.customId === "nuke_cancel") {
        const confirm = new discord.ButtonBuilder()
          .setCustomId("nuke_confirm")
          .setLabel("削除する")
          .setStyle(discord.ButtonStyle.Danger)
          .setDisabled(true);

        const cancel = new discord.ButtonBuilder()
          .setCustomId("nuke_cancel")
          .setLabel("キャンセル")
          .setStyle(discord.ButtonStyle.Secondary)
          .setDisabled(true);

        const row = new discord.ActionRowBuilder().addComponents(confirm, cancel);

        const embed = new discord.EmbedBuilder()
          .setTitle("nuke")
          .setDescription("キャンセルしました。");

        confirmation.reply({ embeds: [embed], components: [row] });
        await res.delete();
      }
    } catch (error) {
      const confirm = new discord.ButtonBuilder()
        .setCustomId("nuke_confirm")
        .setLabel("削除する")
        .setStyle(discord.ButtonStyle.Danger)
        .setDisabled(true);

      const cancel = new discord.ButtonBuilder()
        .setCustomId("nuke_cancel")
        .setLabel("キャンセル")
        .setStyle(discord.ButtonStyle.Secondary)
        .setDisabled(true);

      const row = new discord.ActionRowBuilder().addComponents(confirm, cancel);

      const embed = new discord.EmbedBuilder()
        .setTitle("nuke")
        .setDescription("タイムアウトしました。");

      interaction.followUp({ embeds: [embed], components: [row]});
      await res.delete();
    }
  },
};