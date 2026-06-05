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

// ================ CONFIG =================
const TOKEN = process.env.TOKEN;
const GUILD_ID = "1329730058503323728";
const VC_ID = "1503884194827210802";

// ============= JOIN FUNCTION =============
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

// ============= AUTO REJOIN ===============
client.on('voiceStateUpdate', (oldState, newState) => {
  if (oldState.member?.user.id === client.user.id) {
    if (!newState.channel) {
      console.log("⚠️ BOT LEFT VC → REJOINING...");
      setTimeout(() => {
        joinVC();
      }, 10); // 10ms ≈ 0.01s
    }
  }
});

// ================= LOGIN =================
client.login(TOKEN);