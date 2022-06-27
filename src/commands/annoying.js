"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let isSpamming = false;
function startSpamming(context, commandArguments) {
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
}
function stopSpamming(context, commandArguments) {
    isSpamming = false;
}
function registerCommand(commands) {
    commands.set("$$$start_spamming$$$", startSpamming);
    commands.set("$$$stop_spamming$$$", stopSpamming);
}
exports.default = {
    registerCommand
};
//# sourceMappingURL=annoying.js.map