import Discord from "discord.js"
import Secrets from "../data/secrets.json"
import CommandHandler from "./command-handler"

import AnnoyingCommands from "./commands/annoying"

let commands = new Map<string, CommandHandler>()

AnnoyingCommands.registerCommand(commands)

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
    let commandName = message.content.split(" ")[0]
    let commandArguments = message.content.substring(commandName.length)
    
    let commandHandler = commands.get(commandName)
    if (commandHandler != undefined) {
        commandHandler(message, commandArguments)
    } else {
        // Do other stuff that are not command related.
    }
})

client.login(Secrets.TOKEN)