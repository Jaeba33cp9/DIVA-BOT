require('dotenv').config();

console.log("TOKEN:", process.env.TOKEN);

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('clientReady', () => {
  console.log(`${client.user.tag} online`);
});

client.login(process.env.TOKEN);