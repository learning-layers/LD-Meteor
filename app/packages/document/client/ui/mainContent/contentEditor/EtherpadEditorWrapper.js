import React, {Component} from 'react'
import IFrameWithOnLoad from './IframeWithOnLoad'
import { Meteor } from 'meteor/meteor'
import Cookies from 'cookies-js'
import ContextMenu from './ContextMenu'
import EventEmitterInstance from '../../../../../../common/client/EventEmitter'

const etherpadEndpoint = Meteor.settings.public.etherpad.endpoint

class EtherpadEditorWrapper extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cookieSet: false,
      cookieDomain: null,
      iframeLoadingStatus: 'red',
      iframeNotYetLoaded: 0,
      showContextMenu: false
    }
    this.closingCode = function closingCode () {
      let result = this.removeEtherpadCookie()
      console.log(result)
      return null
    }.bind(this)
  }
  componentDidMount () {
    window.addEventListener('beforeunload', this.closingCode, false)
    window.addEventListener('unload', this.closingCode, false)
    Meteor.call('getEtherpadSession', this.props.documentId, (err, res) => {
      if (err) {
        console.error('err=' + JSON.stringify(err))
      }
      if (res) {
        console.log('res=' + JSON.stringify(res))
        let domain
        if (res.domain.indexOf(':') === -1) {
          domain = res.domain
        } else {
          domain = res.domain.split(':')[0]
        }
        Cookies.set('sessionID', res.sessionId, { domain: domain })
        this.setState({
          cookieSet: true,
          cookieDomain: domain
        })
      }
    })
    this.contextMenuSubscription = EventEmitterInstance.addListener('close-content-editor-context-menu', () => { this.setState({ showContextMenu: false }) })
  }
  componentWillUnmount () {
    this.removeEtherpadCookie()
    window.removeEventListener('beforeunload', this.closingCode, false)
    window.removeEventListener('unload', this.closingCode, false)
    if (this.contextMenuSubscription) {
      this.contextMenuSubscription.remove()
    }
  }
  removeEtherpadCookie () {
    if (this.state.cookieDomain) {
      Cookies.expire('sessionID', { domain: this.state.cookieDomain })
    }
    return true
  }
  getOffset (el) {
    var _x = 0
    var _y = 0
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      _x += el.offsetLeft - el.scrollLeft
      _y += el.offsetTop - el.scrollTop
      el = el.offsetParent
    }
    console.log('top=' + _y + ', left=' + _x)
    return { top: _y, left: _x }
  }
  openContextMenu (clientX, clientY, selection) {
    this.setState({ showContextMenu: true, clientX: clientX, clientY: clientY, selection: selection })
  }
  onIframeLoaded () {
    if (this.props.etherpadGroupPad) {
      console.log('IFrame loaded with etherpad writing access')
    } else {
      console.log('IFrame loaded with etherpad read only access')
    }
    Meteor.setTimeout(() => {
      this.setState({
        iframeLoadingStatus: 'red'
      })
      try {
        let iframe = document.getElementById('etherpadEditorIframe')
        let idoc = iframe.contentDocument || iframe.contentWindow.document
        this.setState({
          iframeLoadingStatus: 'lightred'
        })
        let aceOuter = idoc.getElementsByName('ace_outer')[0]
        let idocAceOuter = aceOuter.contentDocument || aceOuter.contentWindow.document
        this.setState({
          iframeLoadingStatus: 'orange'
        })
        let aceInner = idocAceOuter.getElementsByName('ace_inner')[0]
        let idocAceInner = aceInner.contentDocument || aceInner.contentWindow.document
        this.setState({
          iframeLoadingStatus: 'yellow'
        })
        let selection = idocAceInner.getSelection()
        idocAceInner.addEventListener('click', (e) => {
          // DocumentActions.closeMainContentContexMenu()
          console.log('close context menu')
        })
        idocAceInner.addEventListener('contextmenu', (e) => {
          let selectionObj = selection.getRangeAt(0)
          let content = selectionObj.cloneContents()
          let span = window.document.createElement('SPAN')
          span.appendChild(content)
          let htmlContent = span.innerHTML
          let currentSelection = {
            startOffset: selectionObj.startOffset,
            endOffset: selectionObj.endOffset,
            htmlContent: htmlContent,
            documentId: this.props.documentId
          }
          console.info(currentSelection)
          // let isSelectionAvailable = true
          /* if (currentSelection.startOffset !== currentSelection.endOffset) {
              isSelectionAvailable = true;
          } */
          /* DocumentActions.openMainContentContexMenu({
              clientX: e.clientX,
              clientY: e.clientY + this.getOffset(iframe).top + 60,
              currentSelection: currentSelection,
              isSelectionAvailable: isSelectionAvailable,
              document: this.props.document
          }, this.props.document.title); */
          this.openContextMenu(
            e.clientX,
            e.clientY + this.getOffset(iframe).top,
            currentSelection
          )
          e.preventDefault()
        })
        this.setState({
          iframeLoadingStatus: 'green'
        })
      } catch (e) {
        this.iframeNotYetLoaded++
        if (this.iframeNotYetLoaded <= 40) {
          console.error(e)
        } else {
          this.onIframeLoaded()
        }
      }
    }, 1000)
  }
  render () {
    const { etherpadGroupPad, etherpadReadOnlyId } = this.props
    const { clientX, clientY, selection } = this.state
    let etherpadPadUrl
    if (etherpadGroupPad) {
      etherpadPadUrl = etherpadEndpoint + '/p/' + etherpadGroupPad
    } else {
      etherpadPadUrl = etherpadEndpoint + '/p/' + etherpadReadOnlyId
    }
    let iframeLoadingStatusIndicator = <div style={{backgroundColor: this.state.iframeLoadingStatus, width: '7px', height: '7px', position: 'absolute'}} />
    return <div className='etherpad-editor-wrapper'>
      {this.state.showContextMenu ? <ContextMenu eventTypes={['click']} clientX={clientX} clientY={clientY} selection={selection} documentId={this.props.documentId} /> : null}
      <div className='iframe-loading-inidicator'>
        {iframeLoadingStatusIndicator}
      </div>
      {this.state.cookieSet ? <IFrameWithOnLoad id='etherpadEditorIframe' name='etherpadEditor' src={etherpadPadUrl} scrolling='no' onLoaded={() => this.onIframeLoaded()} seamless /> : null}
    </div>
  }
}

EtherpadEditorWrapper.propTypes = {
  documentId: React.PropTypes.string,
  etherpadGroupPad: React.PropTypes.string,
  etherpadReadOnlyId: React.PropTypes.string
}

export default EtherpadEditorWrapper
