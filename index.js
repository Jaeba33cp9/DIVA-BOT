require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  PermissionsBitField
} = require('discord.js');

const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ================= CONFIG =================
const TOKEN = process.env.TOKEN;
const GUILD_ID = "1329730058503323728";
const VC_ID = "1501394092884492378";

// ================= GAME MODE ROLE =================
const GAME_MODE_ROLE_ID = "1504357738069885019";

// ================= ALLOWED ROLES =================
const ALLOWED_GAME_ROLES = {
  "・〢among us": "1498071614225387660",
  "・〢valorant": "1498071615685132368",
  "・〢𝗣𝗨𝗕𝗚": "1498071617828294727",
  "・〢𝗚𝗧𝗔 𝗩": "1498071618306441236",
  "・〢Brawlhalla": "1504330938237059123",
  "・〢REPO": "1505536597897117728",
  "・〢𝗥𝗢𝗕𝗟𝗢𝗫": "1498384166398722129",
  "・〢EFOOTBALL": "1498744954183356649",
  "・〢FREE FIRE": "1498744976576741507"
};

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

// ================= TAG SYSTEM =================
client.on('messageCreate', async (message) => {

  if (message.author.bot) return;

  // خاص الرسالة تبدا بـ @
  if (!message.content.startsWith('@')) return;

  const roleName = message.content.slice(1).trim();

  if (!roleName) return;

  const member = message.member;

  // ================= ADMIN CHECK =================
  const isAdmin = member.permissions.has(
    PermissionsBitField.Flags.Administrator
  );

  // ================= GAME MODE CHECK =================
  const hasGameModeRole = member.roles.cache.has(
    GAME_MODE_ROLE_ID
  );

  // ================= NO PERMISSION =================
  if (!isAdmin && !hasGameModeRole) {
    return;
  }

  // ================= EVERYONE =================
  if (roleName.toLowerCase() === 'everyone') {

    // غير الأدمن يقدر يدير everyone
    if (!isAdmin) {
      return message.reply({
        content: "❌ غير الرولات لي فيهم Administrator يقدرو يtagiw everyone."
      });
    }

    await message.channel.send({
      content: "@everyone"
    });

    return;
  }

  // ================= ADMIN ROLE TAG =================
  if (isAdmin) {

    const anyRole = message.guild.roles.cache.find(
      r => r.name.toLowerCase() === roleName.toLowerCase()
    );

    if (!anyRole) return;

    await message.channel.send({
      content: `${anyRole}`
    });

    return;
  }

  // ================= GAME MODE ROLE TAG =================
  const roleId = Object.entries(ALLOWED_GAME_ROLES).find(
    ([name]) => name.toLowerCase() === roleName.toLowerCase()
  )?.[1];

  if (!roleId) {
    return;
  }

  const role = message.guild.roles.cache.get(roleId);

  if (!role) return;

  await message.channel.send({
    content: `${role}`
  });

});

// ================= LOGIN =================
client.login(TOKEN);