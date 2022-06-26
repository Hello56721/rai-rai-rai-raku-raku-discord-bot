"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const secrets_json_1 = __importDefault(require("../data/secrets.json"));
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
client.login(secrets_json_1.default.TOKEN);
//# sourceMappingURL=main.js.map