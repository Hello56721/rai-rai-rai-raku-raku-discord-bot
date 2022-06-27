import Discord from "discord.js"

type CommandHandler = (context: Discord.Message, commandArguments: string) => void

export default CommandHandler