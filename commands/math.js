import discord from 'discord.js';
import * as math from 'mathjs';
import fs from 'fs/promises';


// 数学関数のデータを生成する関数
const generateMathFunctionData = (func, startX, endX, step) => {
    const data = [];
    for (let x = startX; x <= endX; x += step) {
        const y = func(x);
        data.push({ x, y });
    }
    return data;
};

// グラフを描画する関数
const drawGraph = async (data, filePath) => {
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');

    // グラフの描画
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    data.forEach(point => {
        ctx.lineTo(point.x, canvas.height / 2 - point.y);
    });
    ctx.strokeStyle = '#FF0000'; // グラフの色
    ctx.lineWidth = 2;
    ctx.stroke();

    // 画像をファイルとして保存
    const out = fs.createWriteStream(filePath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    await new Promise((resolve, reject) => {
        out.on('finish', resolve);
        out.on('error', reject);
    });
};


export default {
  data: new discord.SlashCommandBuilder()
    .setName('math')
    .setDescription('math commands')

    .addSubcommand(command => command
      .setName('calclate')
      .setDescription('数式を計算')
      .addStringOption(option => option
        .setName('formula')
        .setDescription('数式')
        .setRequired(true)
      )
    )

    .addSubcommand(command => command
      .setName('graph')
      .setDescription('グラフを生成')
      .addStringOption(option => option
        .setName('expr')
        .setDescription('関数')
        .setRequired(true)
      )
    )

  ,
  async execute(interaction) {
    const command = interaction.options.getSubcommand();

    if (command === 'graph') {
      const expr = interaction.options.getString('expr');

      const data = [{ x: [1, 2, 3], y: [1, 2, 3], type: 'scatter' }];
      const layout = { title: 'グラフ', xaxis: { title: 'x軸' }, yaxis: { title: 'y軸' } };
      const figure = { data: data, layout: layout };

      plotly.getImage(figure, { format: 'png', width: 800, height: 600 }, async (err, imageStream) => {
        const fileName = 'graph.png';
        const fileStream = await fs.writeFile(fileName, imageStream);
        await interaction.reply({ files: [fileName] });
      });
    }

  }
};