import Discord from "discord.js"
import CommandHandler from "../command-handler"
import Utilities from "../utilities"

let isSpamming = false

function registerCommands(commands: Map<string, CommandHandler>) {
    commands.set("$$$start_spamming$$$", (context, commandArguments) => {
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
    })
    
    commands.set("$$$stop_spamming$$$", () => {
        isSpamming = false
    })
    
    commands.set("$$$start_spamming_dm$$$", (context, commandArguments) => {
        isSpamming = true
        
        let spamTarget = commandArguments.split(" ")[0];
        let spamMessage = commandArguments.substring(spamTarget.length)
        
        if (spamTarget.length == 0) {
            context.reply("you need to tell me who to spam dm bozo")
            return
        }
        
        if (spamMessage.length == 0) {
            spamMessage = "i like cute girls"
        }
        
        if (Utilities.isMention(spamTarget)) {
            spamTarget = Utilities.mentionToUserID(spamTarget)
        }
        
        function spam(channel: Discord.TextChannel, message: string) {
            if (isSpamming) {
                channel.send(message).catch((error) => {
                    isSpamming = false
                    console.log(error)
                })
                setTimeout(spam, 1500, channel, message)
            }
        }
        
        context.guild?.members.fetch(spamTarget).then((member) => {
            context.reply(`spamming ${member.nickname}'s dm lmao :joy_cat:`)
            spam(member as unknown as Discord.TextChannel, spamMessage)
        }).catch(() => {
            context.reply("something went wrong sorry")
        })
    })
}

export default {
    registerCommands
}