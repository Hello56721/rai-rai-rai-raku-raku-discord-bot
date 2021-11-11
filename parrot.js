const { Client, Intents } = require("discord.js")
const { token } = require("./token.json")
fs = require("fs")

const bot = new Client({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]})

console.log("Token: " + token);

messages = [
    "hi, hitler",
    "that's what hitler would've said",
    "nobody cares",
    "cry abt it :joy_cat:",
    "lol :joy_cat:",
    "do not 69 his mom please"
];

function on_ready()
{
    console.log("Bot is now ready.")
}

async function on_message(message)
{
    if (message.author.id === bot.user.id)
    {
        return;
    }
    
    if (message.author.id == 547898636357337123)
    {
        message.reply(messages[Math.floor(Math.random() * 6)])
    }
}

bot.once("ready", on_ready);
bot.on("messageCreate", on_message)

bot.login(token);