class ChatLineCalculator {
  getChatMessageObject (string) {
    let lines = []
    let lineHeight = 17
    let extractedValue = null
    let remainingString = string
    do {
      extractedValue = remainingString.slice(0, 41)
      remainingString = remainingString.slice(41)
      if (extractedValue) {
        lines.push(extractedValue)
      }
    } while (extractedValue)
    let messageHeigth = Math.ceil(lines * lineHeight)
    return {
      messageHeight: messageHeigth,
      lines: lines
    }
  }
}

export default ChatLineCalculator
