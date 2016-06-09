import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Blaze } from 'meteor/blaze'
import { Template } from 'meteor/templating'
import LDSidebar from '../../../../packages/chat/client/ui/Sidebar'
import { Meteor } from 'meteor/meteor'
import {composeWithTracker} from 'react-komposer'
import VerificationAndTOSInterceptor from './VerificationAndTOSInterceptor'
import Alert from 'react-s-alert'

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('currentUserDetails')
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

let isUserAgreeingWithTOS = function (user) {
  if (user && user.tos) {
    let hasAgreedToTOS = true
    user.tos.forEach(function (tosItem) {
      if (!tosItem.agreed) {
        hasAgreedToTOS = false
      }
    })
    return hasAgreedToTOS
  }
  return false
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
    } else if (!user) {
      isAllowedToEnterRoute = false
    } else {
      isAllowedToEnterRoute = isAllowedToNavigateToThisRoute(requiredRoles, user).result
    }
    let isVerified = false
    let acceptedTermsOfService = false
    if (user) {
      isVerified = userEmailIsVerified(user)
      acceptedTermsOfService = isUserAgreeingWithTOS(user)
    }
    // TODO Add redirection in case of that the user is not allowed to enter the route.
    return (
      <div>
        <div ref='status'></div>
        <header>
          {this.props.header}
        </header>
        <main>
          {isAllowedToEnterRoute ? <div>
            {isPublic && !user ? this.props.content : (<div>
              {isVerified && acceptedTermsOfService || tosNotNeeded ? this.props.content : (
                <VerificationAndTOSInterceptor
                  acceptedTermsOfService={acceptedTermsOfService}
                  isVerified={isVerified}
                  registeredEmails={user.registered_emails} />
              )}
            </div>)}
          </div> : <div>You are not allowed to access this route</div>}
          {this.props.helpCenter}
        </main>
        <LDSidebar />
        <Alert stack={{limit: 3}} position='bottom-left' />
      </div>
    )
  }
}

export default composeWithTracker(onPropsChange)(MainLayout)
