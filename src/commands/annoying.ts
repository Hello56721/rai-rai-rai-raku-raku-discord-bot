import Discord from "discord.js"

let isSpamming = false

function startSpamming(context: Discord.Message, commandArguments: string) {
    if (!isSpamming) {
        function spam(channel: Discord.TextChannel, message: string) {
            if (isSpamming) {
                channel.send(message)
                setTimeout(spam, 1500, channel, message)
            }
        }
        
        spam(context.channel as Discord.TextChannel, commandArguments)
    }
}