require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  PermissionsBitField
} = require('discord.js');

const {
  joinVoiceChannel,
  getVoiceConnection
} = require('@discordjs/voice');

// ================= CLIENT =================
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

const GUILD_ID = '1329730058503323728';
const VC_ID = '1501394092884492378';

// رول GAME MODE
const GAME_MODE_ROLE_ID = '1504357738069885019';

// الرولات المسموح بها
const ALLOWED_GAME_ROLES = {
  '・〢among us': '1498071614225387660',
  '・〢valorant': '1498071615685132368',
  '・〢𝗣𝗨𝗕𝗚': '1498071617828294727',
  '・〢𝗚𝗧𝗔 𝗩': '1498071618306441236',
  '・〢Brawlhalla': '1504330938237059123',
  '・〢REPO': '1505536597897117728',
  '・〢𝗥𝗢𝗕𝗟𝗢𝗫': '1498384166398722129',
  '・〢EFOOTBALL': '1498744954183356649',
  '・〢FREE FIRE': '1498744976576741507'
};

// ================= JOIN VC =================
function joinVC() {

  const guild = client.guilds.cache.get(GUILD_ID);

  if (!guild) {
    console.log('❌ Guild not found');
    return;
  }

  const channel = guild.channels.cache.get(VC_ID);

  if (!channel) {
    console.log('❌ Voice channel not found');
    return;
  }

  // إلا كان already connected
  const existingConnection = getVoiceConnection(GUILD_ID);

  if (existingConnection) return;

  joinVoiceChannel({
    channelId: VC_ID,
    guildId: GUILD_ID,
    adapterCreator: guild.voiceAdapterCreator,
    selfDeaf: false
  });

  console.log('🔊 Joined VC');
}

// ================= READY =================
client.once('ready', () => {

  console.log(`✅ Logged in as ${client.user.tag}`);

  joinVC();
});

// ================= AUTO REJOIN =================
client.on('voiceStateUpdate', (oldState, newState) => {

  // واش البوت خرج
  if (oldState.id === client.user.id && !newState.channelId) {

    console.log('⚠️ Bot disconnected → Rejoining...');

    setTimeout(() => {
      joinVC();
    }, 3000);
  }
});

// ================= TAG SYSTEM =================
client.on('messageCreate', async (message) => {

  try {

    if (message.author.bot) return;
    if (!message.guild) return;

    // خاص الرسالة تبدا بـ @
    if (!message.content.startsWith('@')) return;

    // مثال:
    // @・〢valorant
    // @everyone
    const roleName = message.content.slice(1).trim();

    if (!roleName) return;

    const member = message.member;

    if (!member) return;

    // ================= ADMIN =================
    const isAdmin = member.permissions.has(
      PermissionsBitField.Flags.Administrator
    );

    // ================= GAME MODE =================
    const hasGameMode = member.roles.cache.has(
      GAME_MODE_ROLE_ID
    );

    // ماعندوش صلاحية
    if (!isAdmin && !hasGameMode) return;

    // ================= EVERYONE =================
    if (roleName.toLowerCase() === 'everyone') {

      // غير الأدمن
      if (!isAdmin) {
        await message.reply({
          content: '❌ Only admins can tag everyone.'
        });

        return;
      }

      await message.channel.send({
        content: '@everyone'
      });

      return;
    }

    // ================= ADMIN TAG ANY ROLE =================
    if (isAdmin) {

      const anyRole = message.guild.roles.cache.find(
        role =>
          role.name.toLowerCase() === roleName.toLowerCase()
      );

      if (!anyRole) return;

      await message.channel.send({
        content: `${anyRole}`
      });

      return;
    }

    // ================= GAME MODE TAG =================
    let targetRoleId = null;

    for (const [name, id] of Object.entries(ALLOWED_GAME_ROLES)) {

      if (name.toLowerCase() === roleName.toLowerCase()) {
        targetRoleId = id;
        break;
      }
    }

    if (!targetRoleId) return;

    const role = message.guild.roles.cache.get(targetRoleId);

    if (!role) return;

    await message.channel.send({
      content: `${role}`
    });

  } catch (error) {

    console.log('❌ Message Error:', error);
  }
});

// ================= LOGIN =================
client.login(TOKEN);
