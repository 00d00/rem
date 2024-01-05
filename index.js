const Keyv = require('keyv');
const SQLite = require('sqlite3');

const fs = require('fs');

const discord = require('discord.js');
const client = new discord.Client({
  intents: [
    discord.GatewayIntentBits.Guilds,
    discord.GatewayIntentBits.GuildMessages,
  ],
});




const express = require('express');
const app = express();

app.set('views', './views');
app.set('view engine', 'ejs');


// failed: res.render('failed', {});

app.get('/oauth', (req, res) => {
  const t = req.query.code;
  const serverid = req.query.state
  res.render('success', {
    avatarUrl: 'https://cdn.discordapp.com/avatars/1192454684494016583/92b7d39a1e8f7869e2e36049b595ce34.png',
    username: 'username'
  });
});


app.listen(3000);




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





// イベントを登録
const events = fs.readdirSync('./events/').filter(file => file.endsWith('.js'));

for (const event of events) {
  const data = require(`./events/${event}`);
  if (data.once) {
    client.once(data.name, (...args) => data.execute(client, ...args));
  } else {
    client.on(data.name, (...args) => data.execute(client, ...args));
  }
}


client.login(process.env.TOKEN);