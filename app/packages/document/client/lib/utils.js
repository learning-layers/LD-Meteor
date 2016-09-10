import { jQuery } from 'meteor/jquery'

export const printDocument = function () {
  let iframe = document.getElementById('etherpadEditorIframe')
  let idoc = iframe.contentDocument || iframe.contentWindow.document
  let aceOuter = idoc.getElementsByName('ace_outer')[0]
  let idocAceOuter = aceOuter.contentDocument || aceOuter.contentWindow.document
  let aceInner = idocAceOuter.getElementsByName('ace_inner')[0]
  let idocAceInner = aceInner.contentDocument || aceInner.contentWindow.document
  let body = idocAceInner.getElementsByTagName('body')[0]

  // insert into tinymce
  let iframe2 = document.getElementById('tinymceTextarea_ifr')
  let idoc2 = iframe2.contentDocument || iframe2.contentWindow.document
  let body2 = idoc2.getElementsByTagName('body')[0]
  while (body2.firstChild) {
    body2.removeChild(body2.firstChild)
  }
  jQuery(body2).append(jQuery(body).html())
  setTimeout(() => {
    var newWin = window.frames['printf']
    newWin.document.write('<body>' + jQuery(body2).html() + '</body>')
    newWin.document.close()
    let tinyMCEInstance = document.getElementById('printf')
    tinyMCEInstance.focus()
    tinyMCEInstance.contentWindow.print()
  }, 200)
}

let convertImagesToBase64C = function (callback) {
  let contentDocument = global.tinymce.get('tinymceTextarea').getDoc()
  var regularImages = contentDocument.querySelectorAll('img')
  regularImages = Array.prototype.slice.call(regularImages, 0)
  var canvas = document.createElement('canvas')
  var ctx = canvas.getContext('2d')
  regularImages.forEach(function (regularImage) {
    // preparing canvas for drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    canvas.width = regularImage.width
    canvas.height = regularImage.height
    ctx.drawImage(regularImage, 0, 0)
    // by default toDataURL() produces png image, but you can also export to jpeg
    // checkout function's documentation for more details
    var dataURL = canvas.toDataURL()
    regularImage.setAttribute('src', dataURL)
  })
  canvas.remove()
  callback()
}

export const exportToWord = function (documentTitle) {
  let iframe = document.getElementById('etherpadEditorIframe')
  let idoc = iframe.contentDocument || iframe.contentWindow.document
  let aceOuter = idoc.getElementsByName('ace_outer')[0]
  let idocAceOuter = aceOuter.contentDocument || aceOuter.contentWindow.document
  let aceInner = idocAceOuter.getElementsByName('ace_inner')[0]
  let idocAceInner = aceInner.contentDocument || aceInner.contentWindow.document
  let body = idocAceInner.getElementsByTagName('body')[0]

  // insert into tinymce
  let iframe2 = document.getElementById('tinymceTextarea_ifr')
  let idoc2 = iframe2.contentDocument || iframe2.contentWindow.document
  let body2 = idoc2.getElementsByTagName('body')[0]
  while (body2.firstChild) {
    body2.removeChild(body2.firstChild)
  }
  jQuery(body2).append(jQuery(body).html())

  convertImagesToBase64C(() => {
    setTimeout(() => {
      var contentDocument = global.tinymce.get('tinymceTextarea').getDoc()
      var content = '<!DOCTYPE html>' + contentDocument.documentElement.outerHTML
      // var orientation = document.querySelector('.page-orientation input:checked').value
      var converted = global.htmlDocx.asBlob(content/*, {orientation: orientation}*/)
      global.saveAs(converted, documentTitle + '.docx')
    }, 100)
  })
}
