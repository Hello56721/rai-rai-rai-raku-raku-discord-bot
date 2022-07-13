import Discord from "discord.js"
import CommandHandler from "../command-handler.js"
import arrayShuffle from "array-shuffle"

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
            let names = arrayShuffle(VALORANT_NAMES);
            
            members.each((member) => {
                let nickname = names.pop()
                if (nickname == undefined) {
                    names = arrayShuffle(VALORANT_NAMES);
                    nickname = names.pop()
                    
                    console.log(`[INFO]: Trying to change ${member.user.tag}'s nickname to ${nickname}`)
                    member.setNickname(nickname as string).then((member) => {
                        console.log(`[INFO]: Changed ${member.user.tag}'s nickname to ${member.nickname}.`)
                    }).catch(console.error)
                } else {
                    console.log(`[INFO]: Trying to change ${member.user.tag}'s nickname to ${nickname}`)
                    member.setNickname(nickname as string).then((member) => {
                        console.log(`[INFO]: Changed ${member.user.tag}'s nickname to ${member.nickname}.`)
                    }).catch(console.error)
                }
            })
        })
    })
}

export default {
    registerCommands
}