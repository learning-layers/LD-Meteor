function styledConsoleLog () {
  var argArray = []

  if (arguments.length) {
    var startTagRe = /<span\s+style=(['"])([^'"]*)\1\s*>/gi
    var endTagRe = /<\/span>/gi

    var reResultArray
    argArray.push(arguments[0].replace(startTagRe, '%c').replace(endTagRe, '%c'))
    reResultArray = startTagRe.exec(arguments[0])
    while (reResultArray) {
      argArray.push(reResultArray[2])
      argArray.push('')
      reResultArray = startTagRe.exec(arguments[0])
    }

    // pass through subsequent args since chrome dev tools does not (yet) support console.log styling of the following form: console.log('%cBlue!', 'color: blue;', '%cRed!', 'color: red;');
    for (var j = 1; j < arguments.length; j++) {
      argArray.push(arguments[j])
    }
  }
  console.log.apply(console, argArray)
}

var paintInitialConsoleMessage = function () {
  styledConsoleLog(
    '<span style="color:#AAB;">               ██╗     ██╗██╗  ██╗██╗███╗   ██╗███████╗</span>\n' +
    '<span style="color:#AAB;">               ██║     ██║██║  ██║██║████╗  ██║██╔════╝</span>\n' +
    '<span style="color:#AAB;">               ██║     ██║██║  ██║██║██╔██╗ ██║██║████╗</span>\n' +
    '<span style="color:#AAB;">               ██║     ██║╚██╗██╔╝██║██║██║ ██║██║╚═██║</span>\n' +
    '<span style="color:#AAB;">               ███████╗██║ ╚███╔╝ ██║██║ ╚████║███████║</span>\n' +
    '<span style="color:#AAB;">               ╚══════╝╚═╝  ╚══╝  ╚═╝╚═╝  ╚═══╝╚══════╝</span>\n' +
    '\n' +
    '<span style="color:#AAB;">█████╗  ██████╗██████╗██╗ ██╗███╗   ██╗███████╗███╗   ██╗███████╗███████╗\n</span>' +
    '<span style="color:#AAB;">██║  ██╗██║ ██║██╔═══╝██║ ██║████╗████║██╔════╝████╗  ██║  ██╔══╝██╔════╝\n</span>' +
    '<span style="color:#AAB;">██║  ██║██║ ██║██║    ██║ ██║██╔███║██║███████╗██╔██╗ ██║  ██║   ███████╗\n</span>' +
    '<span style="color:#AAB;">██║  ██║██║ ██║██║    ██║ ██║██║ █╔╝██║██╔════╝██║██║ ██║  ██║   ╚════██║\n</span>' +
    '<span style="color:#AAB;">█████╔═╝██████║██████╗██████║██║ ╚╝ ██║███████╗██║ ╚████║  ██║   ███████║\n</span>' +
    '<span style="color:#AAB;">╚════╝  ╚═════╝╚═════╝╚═════╝╚═╝    ╚═╝╚══════╝╚═╝  ╚═══╝  ╚═╝   ╚══════╝</span>'
  )
  styledConsoleLog(
    '<span style="color:#666666;">Thanks to the following open source projects that made Livng Documents possible:</span>\n\n' +
    '<span style="color:#666666;font-size:16px;font-weight:bold;">Meteor</span>\n' +
    'https://www.meteor.com\n' +
    '====================================\n' +
    '<span style="color:#666666;font-size:16px;font-weight:bold;">React</span>\n' +
    'https://facebook.github.io/react/\n' +
    '====================================\n'
  )
}

paintInitialConsoleMessage()
