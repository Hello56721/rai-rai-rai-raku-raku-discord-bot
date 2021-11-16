const { Client, Intents } = require("discord.js")
const { token } = require("./token.json")
fs = require("fs")

const bot = new Client({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]})

messages = [
    "hi, hitler",
    "that's what hitler would've said",
    "nobody cares",
    "cry abt it :joy_cat:",
    "lol :joy_cat:",
    "if your brain was dynamite there wouldn’t be enough to blow your hat off",
    "you have so many gaps in your teeth it looks like your tongue is in jail",
    "hi wumao",
    "suck my dick, motherfucker",
    "u wanna fight?",
    "no",
    "ok boomer",
    "dats such an original insult u clearly lack love at home"
];

hitlist = [
    "547898636357337123",
    "500457346389245963",
    "690265771955585029"
]

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
    
    if (hitlist.includes(message.author.id))
    {
        message.reply(messages[Math.floor(Math.random() * messages.length)])
    }
}

bot.once("ready", on_ready);
bot.on("messageCreate", on_message)

bot.login(token);