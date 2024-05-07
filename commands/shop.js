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

  const embed = new discord.EmbedBuilder()
    .setColor(types[type])
    .setTitle(`shop-${interaction.options.getSubcommand()}`);
}

async function createPanel(interaction, userId) {
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

      if ( !( /^[a-z0-9_]+$/.test(name) ) ) {
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

      const row = createPanel(interaction, interaction.user.id);

      const embed = createEmbed(
        interaction,
        'normal',
      );

      await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    }



    if (command === 'settings') {
      // settings
    }

  }
};
