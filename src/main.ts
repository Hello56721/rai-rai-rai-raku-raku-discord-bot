import Discord from "discord.js"
import Secrets from "../data/secrets.json"
import CommandHandler from "./command-handler"

import SpamCommands from "./commands/spam"
import NameCommands from "./commands/names"

let commands = new Map<string, CommandHandler>()

SpamCommands.registerCommands(commands)
NameCommands.registerCommands(commands)

function logMessage(message: Discord.Message) {
    let messageAuthor = message.author.tag
    
    let messageChannel = ""
    if (message.channel.isText()) {
        if (message.guild != null) {
            messageChannel = (message.channel as Discord.TextChannel).name
        } else {
            messageChannel = (message.channel as Discord.DMChannel).recipient.tag
        }
    }
    
    let messageGuild = ""
    if (message.guild != null) {
        messageGuild = message.guild.nameAcronym
    }
    
    console.log(`[MESSAGE ${messageAuthor} ${messageGuild} ${messageChannel}]: ${message.content}`)
}

let client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MEMBERS
    ]
})

client.once("ready", (client) => {
    console.log(`[INFO]: Logged in to Discord as ${client.user.tag}.`)
})

client.on("messageCreate", (message) => {
    logMessage(message)
    
    let commandName = message.content.split(" ")[0]
    let commandArguments = message.content.substring(commandName.length + 1)
    
    let commandHandler = commands.get(commandName)
    if (commandHandler != undefined) {
        commandHandler(message, commandArguments)
    } else {
        // Do other stuff that are not command related.
    }
})

client.login(Secrets.TOKEN)