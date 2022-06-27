function mentionToUserID(mention: string): string {
    return mention.substring(2, mention.length - 1)
}

function isMention(potentialMention: string): boolean {
    return potentialMention.startsWith("<@") && potentialMention.endsWith(">")
}

export default {
    mentionToUserID,
    isMention
}