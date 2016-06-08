import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Blaze } from 'meteor/blaze'
import { Template } from 'meteor/templating'
import LDSidebar from '../../../../packages/chat/client/ui/Sidebar'
import { Meteor } from 'meteor/meteor'
import {composeWithTracker} from 'react-komposer'
import VerificationAndTOSInterceptor from './VerificationAndTOSInterceptor'

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('currentUserRegisteredEmails')
  if (handle.ready()) {
    const user = Meteor.users.findOne({'_id': Meteor.userId()})
    onData(null, {user})
  }
}

let userEmailIsVerified = function (user) {
  let isVerified = false
  user.registered_emails.forEach(function (email) {
    if (email.verified) {
      isVerified = true
    }
  })
  return isVerified
}

let isAllowedToNavigateToThisRoute = function (neededRoles, user) {
  // check user roles against needed roles
  return {
    result: true,
    rolesMissing: []
  }
}

class MainLayout extends Component {
  componentDidMount () {
    // Use Meteor Blaze to render the consent form
    /* this.cookieConsentView = Blaze.render(Template.cookieConsentImply,
      ReactDOM.findDOMNode(this.refs.cookieConsentForm))*/
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
      // Blaze.remove(this.statusView)
    } catch (e) {
      //
    }
  }
  render () {
    // <div ref='cookieConsentForm'></div>
    let { user, isPublic, requiredRoles, tosNotNeeded } = this.props
    let isAllowedToEnterRoute
    if (isPublic) {
      tosNotNeeded = true
      isAllowedToEnterRoute = true
    } else if (user === null) {
      isAllowedToEnterRoute = false
    } else {
      isAllowedToEnterRoute = isAllowedToNavigateToThisRoute(requiredRoles, user).result
    }
    let isVerified = false
    if (user) {
      isVerified = userEmailIsVerified(user)
    }
    return (
      <div>
        <div ref='status'></div>
        <header>
          {this.props.header}
        </header>
        <main>
          {isAllowedToEnterRoute ? isVerified || tosNotNeeded ? this.props.content : <VerificationAndTOSInterceptor isVerified={isVerified} registeredEmails={user.registered_emails} /> : 'You are not allowed to access this route'}
          {this.props.helpCenter}
        </main>
        <LDSidebar />
      </div>
    )
  }
}

export default composeWithTracker(onPropsChange)(MainLayout)
