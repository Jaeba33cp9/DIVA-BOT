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

// ================= IDs =================
const GUILD_ID = "1329730058503323728";
const VC_ID = "1501394092884492378";

// ================= SLASH COMMAND =================
const commands = [
  new SlashCommandBuilder()
    .setName('diva')
    .setDescription('DIVA BOT 🔥')
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// ================= READY =================
client.once('ready', async () => {
  console.log(`${client.user.tag} online`);

  try {
    // Register slash command (fast)
    await rest.put(
      Routes.applicationGuildCommands(client.user.id, GUILD_ID),
      { body: commands }
    );

    console.log('Slash Command Registered ✅');

    // JOIN VC
    const channel = client.channels.cache.get(VC_ID);

    if (!channel) {
      return console.log("❌ VC NOT FOUND - check ID");
    }

    joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator
    });

    console.log("🔊 BOT JOINED VC SUCCESS");

  } catch (err) {
    console.log("ERROR:", err);
  }
});

// ================= COMMAND =================
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'diva') {
    await interaction.reply('🔥 BOT IS WORKING');
  }
});

// ================= CRASH FIX =================
process.on('unhandledRejection', err => console.log(err));
process.on('uncaughtException', err => console.log(err));

client.login(process.env.TOKEN);