import Discord from "discord.js"
import CommandHandler from "../command-handler"

let isSpamming = false

function startSpamming(context: Discord.Message, commandArguments: string) {
    if (!isSpamming) {
        function spam(channel: Discord.TextChannel, message: string) {
            if (isSpamming) {
                channel.send(message)
                setTimeout(spam, 1500, channel, message)
            }
        }
        
        isSpamming = true
        
        let spamMessage = ""
        if (commandArguments.length < 1) {
            spamMessage = "i like cute girls"
        } else {
            spamMessage = commandArguments
        }
        
        spam(context.channel as Discord.TextChannel, spamMessage)
    }
}

function stopSpamming(context: Discord.Message, commandArguments: string) {
    isSpamming = false
}

function registerCommand(commands: Map<string, CommandHandler>) {
    commands.set("$$$start_spamming$$$", startSpamming)
    commands.set("$$$stop_spamming$$$", stopSpamming)
}

export default {
    registerCommand
}