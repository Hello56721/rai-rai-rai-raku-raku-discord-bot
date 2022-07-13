import Discord from "discord.js"
import CommandHandler from "../command-handler"

const VALORANT_NAMES = [
    "Brimstone",
    "Viper",
    "Omen",
    "Killjoy",
    "Cypher",
    "Sova",
    "Sage",
    "Phoenix",
    "Jett",
    "Reyna",
    "Raze",
    "Breach",
    "Skye",
    "Yoru",
    "Astra",
    "KAY/O",
    "Chamber",
    "Neon",
    "Fade"
]

function shuffle(a: Array<any>) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function registerCommands(commands: Map<string, CommandHandler>) {
    commands.set("$$$change_names_to_valorant$$$", (context, commandArguments) => {
        context.guild?.members.fetch().then((members) => {
            members.each((member) => {
                let names = shuffle(VALORANT_NAMES);
                
                for (let i = 0; i < 10000000; i++)
                {
                    shuffle(names);
                }
                
                console.log(`Changing name of ${member.user.username}.`)
                member.setNickname(names[Math.floor(Math.random() * names.length - 1)]).catch(console.error);
            })
        })
    })
}

export default {
    registerCommands
}