function mentionToUserID(mention: string): string {
    return mention.substring(2, mention.length - 1)
}

export default {
    mentionToUserID
}