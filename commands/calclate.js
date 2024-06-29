import discord from 'discord.js';

function StakeCalculator(rank, progress) {
    const rankConditions = {
        "bronze": 10000,
        "silver": 50000,
        "gold": 100000,
        "platinum": 250000,
        "platinum2": 500000,
        "platinum3": 1000000,
        "platinum4": 2500000,
        "platinum5": 5000000,
        "platinum6": 10000000,
        "diamond": 25000000
    };

    if (!rankConditions[rank] || progress < 0 || progress > 100) return {};

    const requiredPercent = 100 - progress;
    const requiredDollars = requiredPercent * (rankConditions[rank] / 100);
    return {
        requiredPercent,
        requiredDollars
    };
}

export default {
    data: new discord.SlashCommandBuilder()
        .setName('stake_vip')
        .setDescription('StakeのVIP計算')
        .addStringOption(option => option
            .setName('rank')
            .setDescription('現在のランク')
        )
        .addIntegerOption(option => option
            .setName('progress')
            .setDescription('進行度 (0-100)')
        ),
    async execute(interaction) {
        const rank = interaction.options.getString('rank');
        const progress = interaction.options.getInteger('progress');


        let result;

        if (rank && progress !== null) {
            const { requiredPercent, requiredDollars } = StakeCalculator(rank, progress);
            result = `ランク: ${rank}\n進行度: ${progress}%\n残り必要パーセンテージ: ${requiredPercent}%\n残り必要ドル: ${requiredDollars}`;
        }

        const embed = new discord.EmbedBuilder()
            .setColor(result ? 'Blue' : 'Red')
            .setTitle('stake_vip')
            .setDescription(result || '入力が無効です。');

        await interaction.reply({ embeds: [embed] });
    }
};
