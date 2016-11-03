import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import { Documents } from '../../../../lib/collections'

class ContentViewer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      htmlLoaded: false
    }
  }
  loadHtml () {
    Meteor.call('getEtherpadHtmlContent', this.props.documentId, this.props.accessKey, (err, res) => {
      if (err) {
        this.setState({
          error: err
        })
      } else {
        this.setState({
          htmlLoaded: true,
          html: res
        })
      }
    })
  }
  render () {
    const document = Documents.findOne({ '_id': this.props.documentId }, { etherpadGroupPad: 1 })
    if (Meteor.isServer) {
      let serverHtml, serverError
      let getEtherpadHtmlContentSync = Meteor.wrapAsync(Meteor.call)
      if (document) {
        try {
          let result = getEtherpadHtmlContentSync('getEtherpadHtmlContent', this.props.documentId, this.props.accessKey, (err, res) => {
            if (err) {
              serverError = err
            } else {
              serverHtml = res
            }
          })
          console.log(result)
        } catch (e) {
          serverError = e
        }
        if (serverError) {
          return <div id='content-viewer'>
            Error: {JSON.stringify(serverError)}
          </div>
        } else {
          return <div id='content-viewer'>
            <div dangerouslySetInnerHTML={{__html: serverHtml}} />
          </div>
        }
      }
    }
    if (!this.state.htmlLoaded && !this.state.error) {
      // send a request to the server that the server should return the etherpad content as html
      if (Meteor.isClient) {
        Meteor.setTimeout(() => {
          this.loadHtml()
        }, 0)
      }
      return <div id='content-viewer'>
        loading...
      </div>
    } else if (this.state.error) {
      return <div id='content-viewer'>
        Error: {JSON.stringify(this.state.error)}
      </div>
    } else {
      return <div id='content-viewer'>
        <div dangerouslySetInnerHTML={{__html: this.state.html}} />
      </div>
    }
  }
}

ContentViewer.propTypes = {
  documentId: React.PropTypes.string,
  accessKey: React.PropTypes.string
}

export default ContentViewer
