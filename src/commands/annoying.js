"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = __importDefault(require("../utilities"));
let isSpamming = false;
function registerCommands(commands) {
    commands.set("$$$start_spamming$$$", (context, commandArguments) => {
        if (!isSpamming) {
            function spam(channel, message) {
                if (isSpamming) {
                    channel.send(message);
                    setTimeout(spam, 1500, channel, message);
                }
            }
            isSpamming = true;
            let spamMessage = "";
            if (commandArguments.length < 1) {
                spamMessage = "i like cute girls";
            }
            else {
                spamMessage = commandArguments;
            }
            spam(context.channel, spamMessage);
        }
    });
    commands.set("$$$stop_spamming$$$", () => {
        isSpamming = false;
    });
    commands.set("$$$start_spamming_dm$$$", (context, commandArguments) => {
        var _a;
        isSpamming = true;
        let spamTarget = commandArguments.split(" ")[0];
        let spamMessage = commandArguments.substring(spamTarget.length);
        if (spamTarget.length == 0) {
            context.reply("you need to tell me who to spam dm bozo");
            return;
        }
        if (spamMessage.length == 0) {
            spamMessage = "i like cute girls";
        }
        if (utilities_1.default.isMention(spamTarget)) {
            spamTarget = utilities_1.default.mentionToUserID(spamTarget);
        }
        function spam(channel, message) {
            if (isSpamming) {
                channel.send(message).catch((error) => {
                    isSpamming = false;
                    context.reply("i got blocked :sob:");
                });
                setTimeout(spam, 1500, channel, message);
            }
        }
        (_a = context.guild) === null || _a === void 0 ? void 0 : _a.members.fetch(spamTarget).then((member) => {
            let targetName = "";
            if (member.nickname != null) {
                targetName = member.nickname;
            }
            else {
                targetName = member.user.username;
            }
            member.send(spamMessage).then(() => {
                spam(member, spamMessage);
            }).catch(() => context.reply("cant dm this guy :rage:"));
        }).catch(() => {
            context.reply("something went wrong sorry");
        });
    });
}
exports.default = {
    registerCommands
};
//# sourceMappingURL=annoying.js.map