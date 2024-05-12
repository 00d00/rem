import discord from 'discord.js';
import fs from 'fs/promises';


async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

function createEmbed(interaction, type, content) {
  const types = {
    error: 'Red',
    normal: 'Blue',
    success: 'Green'
  }

  return new discord.EmbedBuilder()
    .setColor(types[type])
    .setTitle(`shop-${interaction.options.getSubcommand()}`)
    .setDescription(content || null);
}

async function createPanel(interaction) {
  const data = JSON.parse(await fs.readFile(`./shop/${interaction.user.id}.json`, 'utf-8'));

  const options = [];

  Object.keys(data).forEach(key => {
    options.push(
      new discord.StringSelectMenuOptionBuilder()
        .setLabel(key)
        .setValue(key)
    );
  });

  const menu = new discord.StringSelectMenuBuilder()
    .setCustomId('shop_select')
    .setPlaceholder('ショップを選択')
    .addOptions(...options);

  return new discord.ActionRowBuilder()
    .addComponents(menu);
}

const newButton = (buttonData) => {
  const components = buttonData.map(data => 
    new discord.ButtonBuilder()
      .setCustomId(data.id)
      .setLabel(data.label)
      .setStyle(data.style || discord.ButtonStyle.Primary)
      .setURL(data.url)
      .setEmoji(data.emoji)
      .setDisabled(data.disabled)
  );

  return new discord.ActionRowBuilder()
    .addComponents(components);
};







export default {
  data: new discord.SlashCommandBuilder()
    .setName('shop')
    .setDescription('shop commands')

    .addSubcommand(command => command
      .setName('create')
      .setDescription('ショップを作成')
      .addStringOption(option => option
        .setName('name')
        .setDescription('ショップ名を設定')
        .setRequired(true)
      )
    )

    .addSubcommand(command => command
      .setName('panel')
      .setDescription('パネルを表示')
    )

    .addSubcommand(command => command
      .setName('settings')
      .setDescription('ショップを編集')
    )

  ,
  async execute(interaction) {
    const command = interaction.options.getSubcommand();

    if (command === 'create') {
      const name = interaction.options.getString('name').toLowerCase();;

      if (!(/^[a-z0-9_]+$/.test(name))) {
        await interaction.reply({ content: "英数字、アンダーバー以外は使用できません。", ephemeral: true });
        return;
      }

      const fileExists = await exists(`./shop/${interaction.user.id}.json`);
      let content;

      if (fileExists) {
        content = await fs.readFile(`./shop/${interaction.user.id}.json`, 'utf-8');
      } else {
        await fs.writeFile(`./shop/${interaction.user.id}.json`, '{}', 'utf-8');
        content = '{}';
      }

      const data = JSON.parse(content);

      if (data[name]) {
        await interaction.reply({ content: '既に同じ名前のショップがあります。', ephemeral: true });
        return;
      }

      if (Object.keys(data).length >= 10) {
        await interaction.reply({ content: 'ショップを10個以上作ることは出来ません。', ephemeral: true });
        return;
      }

      data[name] = [];

      await fs.writeFile(`./shop/${interaction.user.id}.json`, JSON.stringify(data, null, 2), 'utf-8');
      await interaction.reply({ content: 'ショップを作成しました。', ephemeral: true });
    }



    if (command === 'panel') {
      const fileExists = await exists(`./shop/${interaction.user.id}.json`);

      if (!fileExists) {
        const embed = createEmbed(
          interaction,
          'error',
          'ショップが存在しません。作成してからやり直してください。'
        );

        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      const row = await createPanel(interaction, interaction.user.id);

      const embed = createEmbed(
        interaction,
        'normal',
        'ショップを選択してください。'
      );

      const message = await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
      let res;

      try {
        res = await message.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id, time: 60000 });
      } catch (error) {
        const embed = createEmbed(
          interaction,
          'error',
          'タイムアウトしました。'
        );

        await res.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      const data = JSON.parse(await fs.readFile(`./shop/${interaction.user.id}.json`, 'utf-8'));

      const title = res.values[0];
      const shop = data[title];

      if (shop.item.length === 0) {
        const embed = createEmbed(
          interaction,
          'error',
          '先に商品を1つ以上追加してください。'
        );

        await res.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      let description = '';

      shop.item.forEach(item => {
        description += `\`\`\`${item.name} : ${item.price}円\`\`\`\n`;
      });

      const panel = new discord.EmbedBuilder()
        .setTitle(title)
        .setDescription(description);

      await res.reply({ embeds: [panel] });
    }



    if (command === 'settings') {
      const fileExists = await exists(`./shop/${interaction.user.id}.json`);

      if (!fileExists) {
        const embed = createEmbed(
          interaction,
          'error',
          'ショップが存在しません。作成してからやり直してください。'
        );

        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      const row = await createPanel(interaction, interaction.user.id);

      const selectEmbed = createEmbed(
        interaction,
        'normal',
        'ショップを選択してください。'
      );

      const message = await interaction.reply({ embeds: [selectEmbed], components: [row], ephemeral: true });
      let res;

      try {
        res = await message.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id, time: 60000 });
      } catch (error) {
        const embed = createEmbed(
          interaction,
          'error',
          'タイムアウトしました。'
        );

        await res.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      const data = JSON.parse(await fs.readFile(`./shop/${interaction.user.id}.json`, 'utf-8'));

      const title = res.values[0];
      const shop = data[title];

      const embed = new discord.EmbedBuilder()
        .setTitle(`${title}`)
        .setDescription("設定を行うには下の各種ボタンを押して設定を行ってください。")
        .setFields(
          { name: "Shopの実績送信チャンネル", value: shop.achieve_ch === null ? "なし" : `<#${shop.achieve_ch}>` },
          { name: "Shopの購入者ロール", value: shop.buyer_role === null ? "なし" : `<@&${shop.buyer_role}>` },
          { name: "商品数", value: `${shop.item.length}` }
        );

      await res.reply({
        embeds: [embed],
        components: [
          newButton([
            { id: `add_item-${title}`, label: "商品追加", style: discord.ButtonStyle.Success },
            { id: `edit_item-${title}`, label: "商品編集", style: discord.ButtonStyle.Primary },
            { id: `delete_item-${title}`, label: "商品削除", style: discord.ButtonStyle.Danger }
          ]),
          newButton([
            { id: `restock-${title}`, label: "商品補充", style: discord.ButtonStyle.Primary },
            { id: `takeout-${title}`, label: "商品取り出し", style: discord.ButtonStyle.Secondary },
            { id: `confirm-${title}`, label: "在庫確認", style: discord.ButtonStyle.Primary }
          ]),
          newButton([
            { id: `achieve_ch-${title}`, label: "実績チャンネルの設定", style: discord.ButtonStyle.Success },
            { id: `buyer_role-${title}`, label: "購入者用ロールの設定", style: discord.ButtonStyle.Success }
          ]),
          newButton([
            { id: `edit_shop-${title}`, label: "半自動機編集", style: discord.ButtonStyle.Primary },
            { id: `delete_shop-${title}`, label: "半自動機削除", style: discord.ButtonStyle.Danger }
          ])
        ],
        ephemeral: true
      });
    }

  }
};
