# Discord Bot Code (Fixed)

```js
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
const GUILD_ID = '1329730058503323728';
const VC_ID = '1501394092884492378';

// ================= GAME MODE ROLE =================
const GAME_MODE_ROLE_ID = '1504357738069885019';

// ================= ALLOWED GAME ROLES =================
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
    console.log('❌ GUILD NOT FOUND');
    return;
  }

  const channel = guild.channels.cache.get(VC_ID);

  if (!channel) {
    console.log('❌ VC NOT FOUND');
    return;
  }

  try {
    joinVoiceChannel({
      channelId: VC_ID,
      guildId: GUILD_ID,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false
    });

    console.log('🔊 JOINED VC');

  } catch (error) {
    console.log('❌ VC ERROR:', error.message);
  }
}

// ================= READY =================
client.once('ready', () => {
  console.log(`✅ ${client.user.tag} ONLINE`);

  joinVC();
});

// ================= AUTO REJOIN =================
client.on('voiceStateUpdate', (oldState, newState) => {

  if (oldState.id !== client.user.id) return;

  if (!newState.channelId) {

    console.log('⚠️ BOT LEFT VC → REJOINING...');

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

    // لازم الرسالة تبدا بـ @
    if (!message.content.startsWith('@')) return;

    const roleName = message.content.slice(1).trim();

    if (!roleName) return;

    const member = message.member;

    if (!member) return;

    // ================= ADMIN CHECK =================
    const isAdmin = member.permissions.has(
      PermissionsBitField.Flags.Administrator
    );

    // ================= GAME MODE CHECK =================
    const hasGameModeRole = member.roles.cache.has(
      GAME_MODE_ROLE_ID
    );

    // ================= NO PERMISSION =================
    if (!isAdmin && !hasGameModeRole) return;

    // ================= EVERYONE =================
    if (roleName.toLowerCase() === 'everyone') {

      if (!isAdmin) {
        await message.reply('❌ ONLY ADMIN CAN TAG EVERYONE');
        return;
      }

      await message.channel.send('@everyone');
      return;
    }

    // ================= ADMIN CAN TAG ANY ROLE =================
    if (isAdmin) {

      const anyRole = message.guild.roles.cache.find(
        role => role.name.toLowerCase() === roleName.toLowerCase()
      );

      if (!anyRole) return;

      await message.channel.send(`${anyRole}`);
      return;
    }

    // ================= GAME MODE ROLES =================
    const roleId = Object.keys(ALLOWED_GAME_ROLES).find(
      name => name.toLowerCase() === roleName.toLowerCase()
    );

    if (!roleId) return;

    const role = message.guild.roles.cache.get(
      ALLOWED_GAME_ROLES[roleId]
    );

    if (!role) return;

    await message.channel.send(`${role}`);

  } catch (error) {
    console.log('❌ MESSAGE ERROR:', error);
  }
});

// ================= LOGIN =================
client.login(TOKEN);
```

# IMPORTANT

## Install packages

```bash
npm install discord.js @discordjs/voice dotenv
```

## Enable these intents in Discord Developer Portal

* MESSAGE CONTENT INTENT
* SERVER MEMBERS INTENT
* PRESENCE INTENT

## Bot role permissions

Make sure the bot role has:

* Administrator
  OR
* Send Messages
* Mention Everyone
* View Channels
* Connect
* Speak
