import { Client, GatewayIntentBits } from 'discord.js';
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

client.on('voiceStateUpdate', (oldState, newState) => {
  if (newState.channel && (!oldState.channel || oldState.channel.id !== newState.channel.id) && newState.channel.members.size === 1) {
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
      member.id !== newState.member.id
    );

    const mentions = onlineMembers.map(member => `<@${member.id}>`).join(' ');
    if (mentions) {
      targetChannel.send(`${newState.member.user.username} si è collegato al canale: ${newState.channel.name}! ${mentions}`);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);