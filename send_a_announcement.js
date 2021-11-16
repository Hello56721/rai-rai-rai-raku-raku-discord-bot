const { Client, Intents } = require("discord.js")
const { token } = require("./token.json")
fs = require("fs")

const bot = new Client({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]})

console.log("Token: " + token);

function on_ready()
{
    var message = fs.readFileSync("./message.txt", { encoding: "utf-8" })
    
    bot.channels.fetch("885220302169186374").then((channel) => {
        channel.send(message)
    })
    
    setTimeout(() => {
        bot.destroy()
    }, 1000)
}

bot.once("ready", on_ready);

bot.login(token);