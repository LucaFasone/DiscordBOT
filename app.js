import { Client, GatewayIntentBits } from 'discord.js';
import express from 'express'
import 'dotenv/config'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages
  ]
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);

});
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot in esecuzione!');
});
app.listen(PORT, () => {
  console.log(`Server HTTP in ascolto sulla porta ${PORT}`);
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});
client.on('voiceStateUpdate', (_, newState) => {
  if (newState.channel && newState.channel.members && newState.channel.members.size === 1) {
    const targetChannel = newState.guild.channels.cache.find(channel =>
      channel.name === 'join-logs' && channel.isTextBased()
    );
    if (!targetChannel) {
      console.error("Né il canale corrispondente al vocale né 'general' sono stati trovati");
      return;
    }

    const onlineMembers = newState.guild.members.cache.filter(member =>
      member.presence && member.presence.status === 'online' &&
      member.user.username !== "SkibdiBOT" &&
      member.id !== newState.member.id &&
      newState.channel.permissionsFor(member).has('ViewChannel')
    );
    const mentions = onlineMembers.map(member => `<@${member.id}>`).join(' ');


    
    if (mentions) {
    targetChannel.send(`${newState.member.user.displayName} si è collegato al canale: ${newState.channel.name}! ${mentions}`);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);