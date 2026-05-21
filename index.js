require('dotenv').config();

const {
  Client,
  GatewayIntentBits
} = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// حط ID ديال التاب هنا
const CHANNEL_ID = '1501394092884492378';

// ملي البوت يشعل
client.once('clientReady', async () => {
  console.log(`${client.user.tag} online`);

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);

    if (channel) {
      channel.send('DIVA BOT ONLINE 🔥');
    }
  } catch (err) {
    console.log('Channel Error:', err);
  }
});

// reconnect logs
client.on('shardDisconnect', () => {
  console.log('Bot disconnected!');
});

client.on('shardReconnecting', () => {
  console.log('Bot reconnecting...');
});

client.on('shardResume', () => {
  console.log('Bot resumed connection!');
});

// anti crash
process.on('unhandledRejection', error => {
  console.log('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
  console.log('Uncaught exception:', error);
});

client.login(process.env.TOKEN);