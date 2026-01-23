import { 
  Client,
  GatewayIntentBits,
  Events,
  REST,
  Routes,
  SlashCommandBuilder
} from "discord.js";
import http from "http";

//
// ダミーWebサーバー（常駐用）
//
const PORT = process.env.PORT || 8000;
http.createServer((req, res) => {
  res.statusCode = 200;
  res.end("OK");
}).listen(PORT, () => {
  console.log(`Dummy web server running on port ${PORT}`);
});

//
// Discord Bot
//
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

//
// スラッシュコマンド定義
//
const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("疎通確認用コマンド")
    .toJSON()
];

//
// 起動時処理
//
client.once(Events.ClientReady, async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  // コマンド登録
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

  try {
    console.log("⏳ スラッシュコマンド登録中...");
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log("✅ スラッシュコマンド登録完了");
  } catch (error) {
    console.error("❌ コマンド登録失敗:", error);
  }
});

//
// コマンド処理
//
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong! 🏓");
  }
});

client.login(process.env.DISCORD_TOKEN);