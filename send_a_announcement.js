const { Client, Intents } = require("discord.js")
const { token } = require("./token.json")
fs = require("fs")

const bot = new Client({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]})

function on_ready()
{
    bot.channels.fetch("901087334123069530").then((channel) => {
        try
        {
            const message_to_send = fs.readFileSync("./message.txt")
            
            try
            {
                channel.send(message_to_send)
            } catch (exception)
            {
                console.error("[ERROR]: Failed to deliver message.")
            }
        } catch (exception)
        {
            console.error("[ERROR]: Failed to read file message.txt")
        }
    })
    
    bot.destroy()
}

bot.once("ready", on_ready);

bot.login(token);