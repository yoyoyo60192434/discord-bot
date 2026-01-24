import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection } from '@discordjs/voice';
import ytdlp from 'yt-dlp-exec';
import process from 'process';

// ----------------------
// 環境変数
// ----------------------
const TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error("BOT_TOKEN, CLIENT_ID, GUILD_ID を環境変数に設定してください");
  process.exit(1);
}

// ----------------------
// サーバー限定コマンド
// ----------------------
const commands = [
  new SlashCommandBuilder().setName('join').setDescription('VCに接続します'),
  new SlashCommandBuilder().setName('leave').setDescription('VCから切断します'),
  new SlashCommandBuilder()
    .setName('play')
    .setDescription('YouTubeの音声を再生します')
    .addStringOption(option => option.setName('url').setDescription('YouTube URL').setRequired(true)),
  new SlashCommandBuilder().setName('stop').setDescription('再生を停止します'),
].map(cmd => cmd.toJSON());

// ----------------------
// コマンド登録
// ----------------------
const rest = new REST({ version: '10' }).setToken(TOKEN);
(async () => {
  try {
    console.log('サーバー限定コマンドを登録中...');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log('コマンド登録完了！');
  } catch (err) {
    console.error('コマンド登録エラー:', err);
  }
})();

// ----------------------
// BOT本体
// ----------------------
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
const audioPlayer = createAudioPlayer();

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// コマンド処理
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'join') {
    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply('VCに接続してから実行してください');

    joinVoiceChannel({
      channelId: channel.id,
      guildId: interaction.guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator
    });

    await interaction.reply('VCに接続しました！');

  } else if (commandName === 'leave') {
    const connection = getVoiceConnection(interaction.guildId);
    if (connection) {
      connection.destroy();
      await interaction.reply('VCから切断しました');
    } else {
      await interaction.reply('VCに接続していません');
    }

  } else if (commandName === 'play') {
    const url = interaction.options.getString('url');
    const connection = getVoiceConnection(interaction.guildId);

    if (!connection) return interaction.reply('先にVCに接続してください');

    await interaction.reply('再生を開始します…');

    // yt-dlpで音声URL取得
    const info = await ytdlp(url, { dumpSingleJson: true, noWarnings: true, quiet: true });
    const audioUrl = info.url;

    const resource = createAudioResource(audioUrl, { inlineVolume: true });
    audioPlayer.play(resource);
    connection.subscribe(audioPlayer);

    audioPlayer.on(AudioPlayerStatus.Playing, () => console.log(`再生中: ${info.title}`));
    audioPlayer.on(AudioPlayerStatus.Idle, () => console.log('再生完了'));

  } else if (commandName === 'stop') {
    audioPlayer.stop();
    await interaction.reply('再生を停止しました');
  }
});

client.login(TOKEN);
