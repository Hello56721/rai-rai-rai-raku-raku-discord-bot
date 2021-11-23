const { Client, Intents, MessageActionRow, MessageButton, ButtonInteraction } = require("discord.js")
const { token } = require("./token.json")

const bot = new Client({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]})

function on_ready()
{
    console.log("[INFO]: The bot has logged on.")
    
    bot.channels.fetch("885220302169186374").then((channel) => {
        const collector = channel.createMessageComponentCollector({})
        
        collector.on("collect", on_collect);
    });
}

async function on_collect(interaction)
{
    if (interaction.customId == "ez")
    {
        interaction.deferUpdate()
        interaction.channel.send("The button has been pressed by " + interaction.user.username + "!")
    }
}

async function on_message_create(p_message)
{
    if (p_message.author.id == bot.user.id)
    {
        return;
    }
    
    if (p_message.content == "$$$button_test$$$")
    {
        const row = new MessageActionRow()
        
        const ez_button = new MessageButton()
        ez_button.setCustomId("ez")
        ez_button.setLabel("DO NOT PRESS THIS BUTTON")
        ez_button.setStyle("DANGER")
        
        row.addComponents(ez_button)
        
        p_message.channel.send({ content: "d", components: [ row ]})
        
        console.log("Hello.")
    }
}

function on_interaction_create(interaction)
{
    if (interaction.isButton())
    {
        console.log("The button has been pressed.")
    }
}

bot.on("ready", on_ready)
bot.on("messageCreate", on_message_create)
bot.on("interactionCreate", on_interaction_create)

bot.login(token)