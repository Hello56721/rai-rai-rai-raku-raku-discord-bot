function mentionToUserID(mention) {
    return mention.substring(2, mention.length - 1);
}
function isMention(potentialMention) {
    return potentialMention.startsWith("<@") && potentialMention.endsWith(">");
}
export default {
    mentionToUserID,
    isMention
};
//# sourceMappingURL=utilities.js.map