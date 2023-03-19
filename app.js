require("dotenv").config();

const { Client, Events, GatewayIntentBits } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  }
  if (interaction.isMessageComponent()) {
    console.info(interaction);
  }
});

client.login(process.env.DISCORD_TOKEN);
