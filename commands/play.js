import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { QueryType } from 'discord-player';
import { entersState, AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, StreamType } from '@discordjs/voice';
import ytdl from 'ytdl-core';
import ytsr from 'ytsr';

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('音楽を再生します')
    .addStringOption(option => option
      .setName('keyword')
      .setDescription('キーワードまたはurl')
      .setRequired(true)
    )
  ,
  async execute(interaction) {
    const keyword = interaction.options.getString('keyword');

    const filters = await ytsr.getFilters(keyword);
    const filter = filters.get('Type').get('Video');
    const searchResults = await ytsr(filter.url, { limit: 5 });

    const url = searchResults.items[0].url;
    if (!ytdl.validateURL(url)) return interaction.reply(`${url}は処理できません。`);

    const member = interaction.member;
    if (!member || !member.voice.channel) {
      const embed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('play')
        .setDescription('ボイスチャンネルに接続してください');

      await interaction.reply({ embeds: [embed] });
      return;
    }

    const connection = joinVoiceChannel({
      adapterCreator: member.voice.channel.guild.voiceAdapterCreator,
      channelId: member.voice.channel.id,
      guildId: member.voice.channel.guild.id,
      selfDeaf: true,
      selfMute: false
    });

    const embed = new EmbedBuilder()
      .setTitle('play')
      .setDescription(url);

    await interaction.reply({ embeds: [embed] });

    const player = createAudioPlayer();
    connection.subscribe(player);

    const stream = ytdl(ytdl.getURLVideoID(url), {
      filter: format => format.audioCodec === 'opus' && format.container === 'webm',
      quality: 'highest',
      highWaterMark: 32 * 1024 * 1024,
    });

    const resource = createAudioResource(stream, {
      inputType: StreamType.WebmOpus
    });

    player.play(resource);

    await entersState(player,AudioPlayerStatus.Playing, 10 * 1000);
    await entersState(player,AudioPlayerStatus.Idle, 24 * 60 * 60 * 1000);

    connection.destroy();
  }
}