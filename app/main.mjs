// bot.js
import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import 'dotenv/config';

// ----------------------
// 環境変数
// ----------------------
const TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID; // 開発用サーバーID

if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error("環境変数 BOT_TOKEN, CLIENT_ID, GUILD_ID を設定してください");
  process.exit(1);
}

// ----------------------
// サーバー限定コマンド定義
// ----------------------
const commands = [
  {
    name: 'ping',
    description: 'Botの応答速度を確認します'
  },
  {
    name: 'say',
    description: 'BOTにメッセージを言わせます',
    options: [
      {
        name: 'message',
        type: 3, // STRING
        description: 'BOTに言わせたいメッセージ',
        required: true,
      },
    ],
  },
];

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
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'ping') {
    await interaction.reply('Pong! 🏓');
  } else if (commandName === 'say') {
    const message = interaction.options.getString('message');
    await interaction.reply(message);
  }
});

client.login(TOKEN);
