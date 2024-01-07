const axios = require('axios');
const fs = require('fs');
const fp = require('fs').promises;

const discord = require('discord.js');
const client = new discord.Client({
  intents: [
    discord.GatewayIntentBits.Guilds,
    discord.GatewayIntentBits.GuildMessages,
  ],
});



const app = require('express')();

app.set('views', './views');
app.set('view engine', 'ejs');


app.get('/oauth', async (req, res) => {
  const token = req.query.code;
  const state = req.query.state;
  const [ guildId, roleId ] = state.split('-');

  // 失敗時の処理
  if (!token || !guildId || !roleId) {
    res.render('failed', { error: 'URLが不正です。' });
    return;
  }

  let fileContent;

  try{
    fileContent = await fs.readFile(`./serverdata/${guildId}/role.txt`, 'utf-8');
  } catch(err) {
    res.render('failed', { error: 'ロールが不正です。' });
    return;
  }

  if (roleId !== fileContent) {
    res.render('failed', { error: 'ロールが不正です。' });
  }

  

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


client.login(process.env.CLIENT_TOKEN);