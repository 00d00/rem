import discord from 'discord.js';

function StakeCalculator(rank, progress) {
  const rankConditions = {
    "Bronze": 10000,
    "Silver": 50000,
    "Gold": 100000,
    "Platinum I": 250000,
    "Platinum II": 500000,
    "Platinum III": 1000000,
    "Platinum IV": 2500000,
    "Platinum V": 5000000,
    "Platinum VI": 10000000,
    "Daimond": 25000000
  };

  if (!rankConditions[rank] || progress < 0 || progress > 100) return {};

  const requiredPercent = 100 - progress;
  const requiredDollars = requiredPercent * (rankConditions[rank] / 100);
  return requiredDollars;
}

export default {
  data: new discord.SlashCommandBuilder()
    .setName('stake_vip')
    .setDescription('StakeのVIP計算')
    .addStringOption(option => option
      .setName('rank')
      .setDescription('次のランク')
      .addChoices(
        { name: 'Bronze', value: 'Bronze' },
        { name: 'Silver', value: 'Silver' },
        { name: 'Gold', value: 'Gold' },
        { name: 'Platinum I', value: 'Platinum I' },
        { name: 'Platinum II', value: 'Platinum II' },
        { name: 'Platinum III', value: 'Platinum III' },
        { name: 'Platinum IV', value: 'Platinum IV' },
        { name: 'Platinum V', value: 'Platinum V' },
        { name: 'Platinum VI', value: 'Platinum VI' },
        { name: 'Diamond', value: 'Diamond' }
      )
      .setRequired(true)
    )
    .addIntegerOption(option => option
      .setName('progress')
      .setDescription('進行度 (0-100)')
      .setRequired(true)
    ),
  async execute(interaction) {
    const rank = interaction.options.getString('rank');
    const progress = interaction.options.getInteger('progress');


    let result;

    if (rank && progress !== null) {
      const req = StakeCalculator(rank, progress);
      result = `次のランク: ${rank}\n進行度: ${progress}%\n残り必要ドル: ${req}`;
    }

    const embed = new discord.EmbedBuilder()
      .setColor(result ? 'Blue' : 'Red')
      .setTitle('stake_vip')
      .setDescription(result || '入力が無効です。');

    await interaction.reply({ embeds: [embed] });
  }
};
