import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Blaze } from 'meteor/blaze'
import { Template } from 'meteor/templating'
import LDSidebar from '../../../../packages/chat/client/ui/Sidebar'
import { Meteor } from 'meteor/meteor'
import {composeWithTracker} from 'react-komposer'
import VerificationAndTOSInterceptor from './VerificationAndTOSInterceptor'
import Alert from 'react-s-alert'
import { FlowRouter } from 'meteor/kadira:flow-router-ssr'

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
    
    if (!user && !isAllowedToEnterRoute) {
      Meteor.setTimeout(function () {
        FlowRouter.go('/')
        Meteor.setTimeout(function () {
          Alert.error('Error: You were redirected to the front page because you didn\'t have permission to access the previous site!')
        }, 70)
      }, 150)
    }
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
          </div> : <div className='container'>
            <div className='panel panel-danger'>
              <div className='panel-heading'><h2>Access Forbidden</h2></div>
              <div className='panel-body'>
                <div className='access-forbidden-panel-content-wrapper'>
                  <img src='/stop-sign-35069.svg' alt='Stop Sign' />
                  You don't have permission to be here...
                </div>
              </div>
            </div>
          </div>}
          {this.props.helpCenter}
        </main>
        <LDSidebar />
        <Alert stack={{limit: 3}} position='bottom-left' />
      </div>
    )
  }
}

export default composeWithTracker(onPropsChange)(MainLayout)
