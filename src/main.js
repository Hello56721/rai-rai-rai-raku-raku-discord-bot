"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const secrets_json_1 = __importDefault(require("../data/secrets.json"));
const annoying_1 = __importDefault(require("./commands/annoying"));
let commands = new Map();
annoying_1.default.registerCommand(commands);
let client = new discord_js_1.default.Client({
    intents: [
        discord_js_1.default.Intents.FLAGS.GUILDS,
        discord_js_1.default.Intents.FLAGS.GUILD_MESSAGES
    ]
});
client.once("ready", (client) => {
    console.log(`[INFO]: Logged in to Discord as ${client.user.tag}.`);
    client.user.setActivity("OnlyFans", { type: "WATCHING" });
});
client.on("messageCreate", (message) => {
    let commandName = message.content.split(" ")[0];
    let commandArguments = message.content.substring(commandName.length);
    let commandHandler = commands.get(commandName);
    if (commandHandler != undefined) {
        commandHandler(message, commandArguments);
    }
    else {
        // Do other stuff that are not command related.
    }
});
client.login(secrets_json_1.default.TOKEN);
//# sourceMappingURL=main.js.map