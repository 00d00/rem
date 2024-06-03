import discord from 'discord.js';
import fs from 'fs/promises';

export default {
  data: new discord.SlashCommandBuilder()
    .setName('log')
    .setDescription('log設定')

    .addStringOption(command => command
      .setName('item')
      .setDescription('設定する項目')
      .setRequired(true)
			.addChoices(
				{ name: '入退出', value: 'join' },
				{ name: 'モデレーション', value: 'mod' },
				{ name: 'メッセージ', value: 'message' },
			)
    )
  ,
  async execute(interaction) {
    const item = interaction.options.getString('item');

    let guild;

    try {
      guild = JSON.parse(await fs.readFile(`./guilds-data/${interaction.guild.id}.json`, 'utf-8'));
    } catch (error) {
      guild = {};
      await fs.writeFile(`./guilds-data/${interaction.guild.id}.json`, JSON.stringify(guild), 'utf-8');
    }

    if (!guild.log) guild.log = {};

    const setOrUnset = guild.log[item] ? '解除' : '設定';

    if (guild.log[item]) delete guild.log[item];
    else guild.log[item] = interaction.channel.id;

    await fs.writeFile(`./guilds-data/${interaction.guild.id}.json`, JSON.stringify(guild), 'utf-8');

    const values = {
      join: '入退出',
      mod: 'モデレーション',
      message: 'メッセージ'
    };

    const embed = new discord.EmbedBuilder()
      .setColor('Blue')
      .setTitle('log')
      .setDescription(`${values[item]}ログを${setOrUnset}しました。`);

    await interaction.reply({ embeds: [embed] });
  }
};