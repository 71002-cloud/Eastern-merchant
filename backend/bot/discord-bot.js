require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

if (!process.env.DISCORD_BOT_TOKEN) {
  throw new Error("Missing DISCORD_BOT_TOKEN in .env");
}

if (!process.env.CHANNEL_ID) {
  throw new Error("Missing CHANNEL_ID in .env");
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

let cachedChannel = null;
let scanIntervalId = null;
let roleIdMap = {};

async function populateRoleIdMap() {
  roleIdMap = {};
  for (const [, guild] of client.guilds.cache) {
    for (const [, role] of guild.roles.cache) {
      roleIdMap[role.name] = role.id;
    }
  }
  console.log("Role ID map populated:", roleIdMap);
}

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  await populateRoleIdMap();

  const { runner } = require("./bot-logic");

  runner().catch((error) => {
    console.error("Initial runner failed:", error.message);
  });

  if (scanIntervalId) {
    clearInterval(scanIntervalId);
  }

  scanIntervalId = setInterval(() => {
    runner().catch((error) => {
      console.error("Scheduled runner failed:", error.message);
    });
  }, 5 * 60 * 1000);
});

async function getChannel() {
  if (cachedChannel) {
    return cachedChannel;
  }

  const channel = await client.channels.fetch(process.env.CHANNEL_ID);
  if (!channel) {
    throw new Error("Channel not found");
  }

  cachedChannel = channel;
  return channel;
}

async function sendStringToChannel(text) {
  if (typeof text !== "string" || text.trim().length === 0) {
    throw new Error("sendStringToChannel(text) requires a non-empty string");
  }

  try {
    const channel = await getChannel();
    await channel.send(text);
  } catch (error) {
    cachedChannel = null;
    throw error;
  }
}

module.exports = {
  sendStringToChannel,
  client,
  getRoleIdMap: () => roleIdMap
};

client.login(process.env.DISCORD_BOT_TOKEN).catch((error) => {
  console.error("Discord login failed:", error.message);
});