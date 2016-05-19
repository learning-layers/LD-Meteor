import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Blaze } from 'meteor/blaze'
import { Template } from 'meteor/templating'

class MainLayout extends Component {
  componentDidMount () {
    // Use Meteor Blaze to render the consent form
    this.cookieConsentView = Blaze.render(Template.cookieConsentImply,
      ReactDOM.findDOMNode(this.refs.cookieConsentForm))
    this.statusView = Blaze.render(Template.status,
      ReactDOM.findDOMNode(this.refs.status))
    setTimeout(function () {
      try {
        Blaze.remove(this.cookieConsentView)
        Blaze.remove(this.statusView)
      } catch (e) {
        //
      }
    }, 30000)
  }
  componentWillUnmount () {
    // Clean up Blaze view
    try {
      Blaze.remove(this.cookieConsentView)
      Blaze.remove(this.statusView)
    } catch (e) {
      //
    }
  }
  render () {
    return (
      <div>
        <div ref='status'></div>
        <div ref='cookieConsentForm'></div>
        <header>
          {this.props.header}
        </header>
        <main>
          {this.props.content}
          {this.props.helpCenter}
        </main>
      </div>
    )
  }
}

export default MainLayout
