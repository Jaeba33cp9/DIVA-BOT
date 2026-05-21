require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');

console.log(process.env.TOKEN);

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('clientReady', () => {
  console.log(`${client.user.tag} online`);
});

client.login(process.env.TOKEN);