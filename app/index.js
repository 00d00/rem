const discord = require('discord.js');
const { Client, Intents, MessageEmbed, ButtonInteraction, MessageActionRow, Constants, MessageButton} = require('discord.js');
const fs = require('fs');
const axios = require('axios');
const path = require('path')

const intents = new Intents([
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  Intents.FLAGS.GUILD_MEMBERS,
]);

const client = new Client({ intents: intents });



client.on('messageCreate', async (message) => {
  if (message.content === '^dev refresh') {
    const commands = await client.application.commands.fetch();
    for (const command of commands.values()) {
      await command.delete();
    }
    message.channel.send(`スラッシュコマンドの更新が完了しました。\nターミナルからrefreshを実行してください。`);
  }
});


client.on('messageCreate', async (message) => {
  const name = "!s";
  if (message.author.id == 1097780939368714310 && message.content == name) {
    message.channel.send("Hello i5_xyz!");
  } else if (message.content === "!s") {
    message.channel.send(":x: このコマンドを実行する権限がありません。");
  }
});





const guildId = 1149896846471331910;

client.on('messageUpdate', (oldMessage, newMessage) => {
  if (oldMessage.guild.id == guildId) {
    // メッセージが指定したギルド内で編集されたときの処理
    const logChannel = client.channels.cache.find(ch => ch.name === "message-log");
    if (logChannel) {
      const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('メッセージが編集されました')
        .addField('送信者', newMessage.author.tag)
        .addField('元のメッセージ', oldMessage.content)
        .addField('編集後のメッセージ', newMessage.content)
      logChannel.send({ embeds: [embed] });
    }
  }
});

client.on('messageDelete', (deletedMessage) => {
  if (deletedMessage.guild.id == guildId) {
    console.log(`メッセージが削除されました: ${deletedMessage.content}`);
    // メッセージが指定したギルド内で削除されたときの処理
    const logChannel = client.channels.cache.find(ch => ch.name === "message-log");
    if (logChannel) {
      logChannel.send(`メッセージが削除されました:
      **送信者:** ${deletedMessage.author.tag}
      **削除されたメッセージ:** ${deletedMessage.content}`);
    
    }
  }
});







const commands = {};
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands[command.data.name] = command;
}

client.once('ready', async() => {
    const data = []
    for (const commandName in commands) {
      data.push(commands[commandName].data)
    }
    await client.application.commands.set(data);
});


//コマンドの実行部分
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const command = commands[interaction.commandName];
  try {
    await command.execute(interaction, discord);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    })
  }
});



// listenersディレクトリを読み込み
const listeners = fs.readdirSync('./listeners/').filter(file => file.endsWith('.js'));

for (const listeneR of listeners) {
  const listenerFunction = require(`./listeners/${listeneR}`);
  listenerFunction(client);
}

















client.login(process.env.BOT_TOKEN);