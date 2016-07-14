import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'

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
    if (!this.state.htmlLoaded && !this.state.error) {
      // send a request to the server that the server should return the etherpad content as html
      Meteor.setTimeout(() => {
        this.loadHtml()
      }, 0)
      return <div id='content-editor'>
        loading...
      </div>
    } else if (this.state.error) {
      return <div id='content-editor'>
        {JSON.stringify(this.state.error)}
      </div>
    } else {
      return <div id='content-editor'>
        <div dangerouslySetInnerHTML={{__html: this.state.html}}></div>
      </div>
    }
  }
}

export default ContentViewer