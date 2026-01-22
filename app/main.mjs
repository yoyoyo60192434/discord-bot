import { Client, GatewayIntentBits } from "discord.js";
import http from "http";

// ダミーWebサーバー（Koyebのヘルスチェック用）
const PORT = process.env.PORT || 8000;
http.createServer((req, res) => {
  res.statusCode = 200;
  res.end("OK");
}).listen(PORT, () => {
  console.log(`Dummy web server running on port ${PORT}`);
});

// Discord Bot
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN)
