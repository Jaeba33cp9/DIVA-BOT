require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder
} = require('discord.js');

const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// ================= CONFIG =================
const TOKEN = process.env.TOKEN;
const GUILD_ID = "1329730058503323728";
const VC_ID = "1501394092884492378";
const GUILD_ID = "1405087442964316290";
const VC_ID = "1433327831038820373";
// ================= JOIN FUNCTION =================
function joinVC() {
  const channel = client.channels.cache.get(VC_ID);

  if (!channel) return console.log("VC NOT FOUND ❌");

  joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator
  });

  console.log("🔊 JOINED VC");
}

// ================= READY =================
client.once('ready', async () => {
  console.log(`${client.user.tag} online`);

  joinVC();
});

// ================= AUTO REJOIN =================
client.on('voiceStateUpdate', (oldState, newState) => {
  // إذا البوت خرج من VC
  if (oldState.member?.user.id === client.user.id) {
    if (!newState.channel) {
      console.log("⚠️ BOT LEFT VC → REJOINING...");
      setTimeout(() => {
        joinVC();
      }, 3000);
    }
  }
});

// ================= LOGIN =================
client.login(TOKEN);
