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
    newWin.document.write('<body>' + jQuery(body2).html() + '<script type=\'text/javascript\' src=\'/pad.css\'></script>' + '</body>')
    newWin.document.close()
    let tinyMCEInstance = document.getElementById('printf')
    tinyMCEInstance.focus()
    tinyMCEInstance.contentWindow.print()
  }, 200)
}
