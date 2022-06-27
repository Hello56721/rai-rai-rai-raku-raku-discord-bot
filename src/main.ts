import Discord from "discord.js"
import Secrets from "../data/secrets.json"

let client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.once("ready", (client) => {
    console.log(`[INFO]: Logged in to Discord as ${client.user.tag}.`)
    
    client.user.setActivity("OnlyFans", { type: "WATCHING" })
})

client.on("messageCreate", (message) => {
    // TODO: Handle commands
})

client.login(Secrets.TOKEN)