const discord = require('discord.js');
const fs = require('fs');

const client = new discord.Client({
  intents: [
    discord.GatewayIntentBits.Guilds,
    discord.GatewayIntentBits.GuildMessages,
    // 他の必要なインテントを追加
  ],
});



// コマンドデータの取得
const commands = new discord.Collection();


fs.readdirSync('commands')
  .filter(file => file.endsWith('.js'))
  .forEach(file => {
    const command = require(`./commands/${file}`);
    commands[command.data.name] = command;
  });


//コマンドを登録
client.once(discord.Events.ClientReady, async() => {
  const data = [];
  for (const commandName in commands) {
    data.push(commands[commandName].data)
  }
  await client.application.commands.set(data);
  client.guilds.cache.forEach(async (guild) => {
    console.log(`NAME: ${guild.name}, ID: ${guild.id}`);
  });
});


// コマンドを実行
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  try {
    await commands[interaction.commandName].execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: `\`\`\`${error}\`\`\``,
      ephemeral: true,
    })
  }
});


client.on('messageCreate', (message) => {
const embed = new discord.EmbedBuilder()
  .setColor(process.env.COLOR)
  .setThumbnail(message.guild.iconURL())
    message.channel.send({ embeds: [embed] });
});


// イベントを登録
const events = fs.readdirSync('./events/').filter(file => file.endsWith('.js'));

for (const event of events) {
  const data = require(`./events/${event}`);
  if (data.once) {
    client.once(data.name, (...args) => data.execute(...args));
  } else {
    client.on(data.name, (...args) => data.execute(...args));
  }
}


client.login('MTE5MjMwMDA0MDE2MTYwNzc0MQ.GvJiyr.PLr00HnnBx0ikj7ZxC51ZoCC-H0pBJjxjWH_eQ');
