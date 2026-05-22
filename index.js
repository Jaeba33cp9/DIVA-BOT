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

// رول الأدمن
const ADMIN_ROLE_NAME = "Administrator";

// رولات الألعاب
const GAME_ROLES = [
  "Free Fire",
  "Valorant",
  "Minecraft",
  "PUBG",
  "Fortnite"
];

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

// ================= DIVATAG COMMAND =================
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // الأمر
  if (!message.content.startsWith('+divatag')) return;

  // ===== CHECK ADMIN ROLE =====
  const isAdmin = message.member.roles.cache.some(
    role => role.name === ADMIN_ROLE_NAME
  );

  // ===== CHECK GAME ROLE =====
  const memberGameRoles = message.member.roles.cache.filter(role =>
    GAME_ROLES.includes(role.name)
  );

  // لازم يكون عندو Admin أو رول لعبة
  if (!isAdmin && memberGameRoles.size === 0) {
    return message.reply(
      "❌ خاصك تكون عندك رول Game أو رول Administrator باش تستعمل هاد الأمر."
    );
  }

  const args = message.content.split(' ').slice(1);

  // ===== TAG EVERYONE =====
  if (args[0] === 'everyone') {

    // غير Administrator يقدر يدير everyone
    if (!isAdmin) {
      return message.reply(
        "❌ غير Administrator يقدر يtagi everyone."
      );
    }

    await message.channel.send({
      content: "@everyone"
    });

    return;
  }

  // ===== TAG GAME ROLE =====
  const roleName = args.join(' ');

  if (!roleName) {
    return message.reply(
      `❌ استعمل:\n+divatag everyone\nأو\n+divatag Free Fire`
    );
  }

  // خاص الرول تكون من GAME_ROLES
  if (!GAME_ROLES.includes(roleName)) {
    return message.reply("❌ هاد الرول ماشي رول لعبة.");
  }

  // المستخدم خاصو يكون عندو نفس الرول
  // إلا كان Admin يقدر يtagi أي رول لعبة
  const hasThatGameRole = message.member.roles.cache.some(
    role => role.name === roleName
  );

  if (!isAdmin && !hasThatGameRole) {
    return message.reply(
      "❌ ماتقدرش تtagi رول لعبة ماعندكش."
    );
  }

  const role = message.guild.roles.cache.find(
    r => r.name === roleName
  );

  if (!role) {
    return message.reply("❌ الرول ما لقيتهاش.");
  }

  await message.channel.send({
    content: `${role}`
  });
});

// ================= LOGIN =================
client.login(TOKEN);