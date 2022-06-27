"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mentionToUserID(mention) {
    return mention.substring(2, mention.length - 1);
}
function isMention(potentialMention) {
    return potentialMention.startsWith("<@") && potentialMention.endsWith(">");
}
exports.default = {
    mentionToUserID,
    isMention
};
//# sourceMappingURL=utilities.js.map