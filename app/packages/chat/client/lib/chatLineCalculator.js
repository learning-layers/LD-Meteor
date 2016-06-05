const characterWidth = 7.313
const maxLineLength = 300
const maxCharactersPerLine = Math.floor(300 / 7.313)

class ChatLineCalculator {
  formatEmotes (text, emotes) {
    console.time('Function #2')
    // split text into single characters
    let splitText = text.split('')
    for (var i in emotes) {
      let e = emotes[i]
      for (var j in e) {
        var mote = e[j]
        if (typeof mote === 'string') {
          // parse the emote position info string
          mote = mote.split('-')
          mote = [parseInt(mote[0]), parseInt(mote[1])]
          let length = mote[1] - mote[0]
          let empty = Array.apply(null, new Array(length + 1)).map(function () { return '' })
          // replace the emote string with empty array values to preserve the original indexes
          splitText = splitText.slice(0, mote[0]).concat(empty).concat(splitText.slice(mote[1] + 1, splitText.length))
          // replace the first emote string position with the image that needs to be inserted at this position
          splitText.splice(mote[0], 1, '<img class="emoticon" src="http://static-cdn.jtvnw.net/emoticons/v1/' + i + '/3.0">')
        }
      }
    }

    let currentLineLength = 0
    let lines = []
    let lineHeight = 17
    let currentLine = ''
    let prevSpacePosition = -1
    for (let i = 0, len = splitText.length; i < len; i++) {
      let c = splitText[i]
      if (c !== '' && c.length <= 1) {
        currentLineLength += characterWidth
        // console.debug('currentLineLength' + currentLineLength)
        if (c === ' ') {
          prevSpacePosition = currentLine.length
        }
        currentLine += c
      } else if (c !== '') {
        console.debug(c)
      }
      if (currentLineLength + characterWidth > maxLineLength) {
        // look at the next char and
        // figure out if the word reaches into the next line
        if (i + 1 < len && splitText[i + 1] !== ' ') {
          // get word length and check if it is too long for one line
          let lengthBeforeBreak = maxCharactersPerLine - (prevSpacePosition + 1)
          console.debug('lengthBeforeBreak=' + lengthBeforeBreak)
          let lengthAfterBreak = 0
          for (let j = prevSpacePosition + lengthBeforeBreak + 1; j < len; j++) {
            let c = splitText[j]
            console.debug('c=' + c)
            if (c === ' ') {
              j = len + 1
            } else {
              lengthAfterBreak++
            }
          }
          console.debug('lengthAfterBreak=' + lengthAfterBreak)
          let wordLength = lengthBeforeBreak + lengthAfterBreak
          console.debug('wordLength=' + wordLength)
          if (wordLength > maxCharactersPerLine) {
            console.debug('word is TOO long for one line')
            console.debug('Pushing line with line length=' + currentLineLength + ', value=' + currentLine)
            currentLineLength = 0
            lines.push(currentLine)
            currentLine = ''
          } else {
            // console.debug('word is not too long for one line')
            // The word is not too long for one line so it makes
            // sense to move it to the next line.
            // --------------------------------------
            // Add the line before the break to lines
            let lineToPush = currentLine.substring(0, prevSpacePosition)
            lines.push(lineToPush)
            console.debug('Pushing line with line length=' + lineToPush.length + ', value=' + lineToPush)
            // extract the word before the break
            let wordBeforeBreak = currentLine.substring(prevSpacePosition + 1, maxCharactersPerLine + 1)
            console.debug('Moving word=' + wordBeforeBreak + ' to new line')
            // set the currentLineLength to the word length
            currentLineLength = wordBeforeBreak.length * characterWidth
            // set the current line to the word that has been moved to the next line
            currentLine = wordBeforeBreak
          }
        } else {
          console.debug('Pushing line with line length=' + currentLineLength + ', value=' + currentLine)
          currentLineLength = 0
          lines.push(currentLine)
          currentLine = ''
        }
      }
    }
    if (currentLine !== '') {
      console.debug('Pushing line with line length=' + currentLineLength + ', value=' + currentLine)
      lines.push(currentLine)
    }
    let messageHeight = Math.ceil(lines.length * lineHeight)
    console.timeEnd('Function #2')
    return {
      messageHeight: messageHeight,
      lines: lines
    }
  }
  getChatMessageObject (string) {
    console.time('Function #1')
    let currentLineLength = 0
    let lines = []
    let lineHeight = 17
    let characterWidth = 7.313
    let currentLine = ''
    for (let i = 0, len = string.length; i < len; i++) {
      let currentCharacter = string.charAt(i)
      // console.debug(string.charAt(i))
      currentLineLength += characterWidth
      currentLine += currentCharacter
      if (currentLineLength + characterWidth > 300) {
        currentLineLength = 0
        lines.push(currentLine)
        currentLine = ''
      }
    }
    if (currentLine !== '') {
      lines.push(currentLine)
    }
    let messageHeight = Math.ceil(lines.length * lineHeight)
    console.timeEnd('Function #1')
    return {
      messageHeight: messageHeight,
      lines: lines
    }
  }
}

export default ChatLineCalculator
