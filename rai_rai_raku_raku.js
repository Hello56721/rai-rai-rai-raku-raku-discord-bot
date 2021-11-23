const
{
    Client,
    Intents,
    DMChannel,
    TextChannel,
    Collection,
    MessageManager,
    CategoryChannel
} = require("discord.js")
const { token } = require("./token.json")
const Str = require("@supercharge/strings")

const bot = new Client
(
    { 
        intents:
        [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.DIRECT_MESSAGES,
        ]
    }
)

let channelToSend = "0"
let spam = false


function onReady()
{
    console.log("[INFO]: The client has logged on as " + bot.user.username + "#" + bot.user.discriminator)
}



function spam_f(channel, prefix, msg, masterMessage)
{
    if (spam === false)
    {
        return
    }
    
    channel.send(prefix + " " + msg).then(() =>
    {
        setTimeout(() => 
        {
            spam_f(channel, prefix, msg, masterMessage);
        }, 1500);
    }).catch((error) => 
    {
        masterMessage.reply("I cannot continue spamming the target because of this error.\n" + 
                            "```" +
                            error +
                            "```")
    })
}



async function onMessageCreate(message)
{
    if (DMChannel.prototype.isPrototypeOf(message.channel))
    {
        console.log("(DM of " + message.channel.recipient.username + "): " + message.author.username + ": " + message.content)
    } else {
        console.log("(#" + message.channel.name + "): " + message.author.username + ": " + message.content)
    }
    
    if (message.author.id == bot.user.id)
    {
        return;
    }
    
    // Check for trademark violations
    if (message.author.id != "690265771955585029" && message.author.id != "725811783012450306")
    {
        part1 = message.content.toLowerCase();
        
        if (part1.includes("disappointment"))
        {
            let part2 = part1.split("disappointment")[1];
            if (part2.includes("immeasurable"))
            {
                let part3 = message.content.split("immeasurable")[1];
                if (part3.includes("day"))
                {
                    let part4 = message.content.split("day")[1];
                    if (part4.includes("ruined"))
                    {
                        message.reply("\"My disappointment is immeasurable and my day is ruined\" and all variations are registered trademarks of 0051 as of October 2021. Please cease and desist from all current and future uses. Thank you in advance for your cooperation.");
                        //message.channel.send("<@690265771955585029> Your trademark has been violated.")
                    }
                }
            }
        }
    }
    
    // Special control commands
    if (message.author.id == "650439182204010496" || message.author.id == "690265771955585029")
    {
        var command = message.content
        if (command.startsWith("$$$send"))
        {
            bot.channels.fetch(channelToSend).then(channel => {
                channel.send(command.split("#|")[1])
            })
        } else if (command.startsWith("$$$set_channel"))
        {
            channelToSend = command.split(" ")[1]
            console.log("Channel is now set to " + channelToSend)
        } else if (command.startsWith("$$$reply"))
        {
            bot.channels.fetch(channelToSend).then(channel => {
                channel.messages.fetch(command.split(" ")[1]).then(msgToReplyTo => {
                    msgToReplyTo.reply(command.split("#|")[1])
                })
            })
        }
    }
    
    if (message.content.startsWith("$$$stop_spamming$$$"))
    {
        spam = false
        return
    }
    
    if (message.content.startsWith("$$$start_spamming$$$"))
    {
        spam = true
        
        let prefix = message.content.split(" ")[1]
        if (prefix === undefined || prefix === "||")
        {
            prefix = ""
        }
        
        let msg = message.content.split("||")[1]
        if (msg === undefined)
        {
            msg = "i like cute girls"
        }
        
        setTimeout(() => {
            spam_f(message.channel, prefix, msg)
        }, 1500)
    }
    
    if (message.content.startsWith("$$$start_spamming_dm$$$"))
    {
        spam = true
        
        let channelId = message.content.split(" ")[1]
        
        let msg = message.content.split("||")[1]
        if (msg == undefined)
        {
            msg = "i like cute girls"
        }
        
        
        
        message.guild.members.fetch(channelId).then((channel) => {
            console.log("Spamming user " + channel.user.username + "'s DM.")
            
            spam_f(channel, "<@" + channelId + ">", msg, message)
            
        }).catch(error => {
            message.reply("The specified user could not be found.");
            console.log(error)
        })
    }
    
    if (message.content.startsWith("$$$nuke_channel$$$"))
    {
        var position = message.channel.position;
        message.channel.clone().then((clonedChannel) => {
            clonedChannel.setPosition(position)
        })
        message.channel.delete()
    }
    
    if (message.content.startsWith("$$$nuke_server$$$"))
    {
        message.channel.guild.channels.fetch().then((channels) => {
            channels.each((channel) => {
                if (CategoryChannel.prototype.isPrototypeOf(channel))
                {
                    return;
                }
                
                var position = channel.position;
                
                channel.clone().then((clonedChannel) => {
                    clonedChannel.setPosition(position)
                    channel.delete().catch(() => {
                        clonedChannel.delete().catch(console.error)
                    })
                }).catch(console.error)
                
            })
        }).catch(console.error)
    }
}

bot.on("ready", onReady)
bot.on("messageCreate", onMessageCreate)

bot.login(token)
