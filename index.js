require('dotenv').config();

const {
  Client,
  GatewayIntentBits
} = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// حط Channel ID هنا
const CHANNEL_ID = '1498049200334700584';

client.once('clientReady', async () => {
  console.log(`${client.user.tag} online`);

  try {

    const channel = await client.channels.fetch(CHANNEL_ID);

    console.log('CHANNEL:', channel);

    if (!channel) {
      console.log('CHANNEL NOT FOUND');
      return;
    }

    await channel.send('DIVA BOT ONLINE 🔥');

    console.log('MESSAGE SENT');

  } catch (error) {

    console.log('CHANNEL ERROR:', error);

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
  console.log('Unhandled Rejection:', error);
});

process.on('uncaughtException', error => {
  console.log('Uncaught Exception:', error);
});

client.login(process.env.TOKEN);