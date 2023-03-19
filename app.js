require("dotenv").config();

const { Configuration, OpenAIApi } = require("openai");
const { Client, Events, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  } else if (interaction.isMessageComponent()) {
    console.info(interaction);
  } else {
    console.log("others");
    console.info(interaction);
  }
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (
    message.author.id !== process.env.ADMIN_ID &&
    message.mentions.users.find(
      (user) => user.id === process.env.CHATGPT_USER_ID
    ) === undefined
  ) {
    return;
  }
  const question = message.content.replace("<@1086957904155922482>", "");
  console.log(`${message.author.username}: ${question}`);
  if (question === "") return;
  const answer = await askChatGPT(question);
  console.log(`${answer.role}: ${answer.content}`);
  message.channel.send(answer);
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

client.login(process.env.DISCORD_TOKEN);

async function askChatGPT(content) {
  const request = {
    role: "user",
    content: content,
  };

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [request],
    temperature: 0.4,
    max_tokens: 1000,
  });
  return response.data.choices[0].message;
}
