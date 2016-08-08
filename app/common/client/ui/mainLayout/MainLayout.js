import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Blaze } from 'meteor/blaze'
import { Template } from 'meteor/templating'
import LDSidebar from '../../../../packages/chat/client/ui/Sidebar'
import { Meteor } from 'meteor/meteor'
import { composeWithTracker } from 'react-komposer'
import VerificationAndTOSInterceptor from './VerificationAndTOSInterceptor'
import Alert from 'react-s-alert'
import Login from './Login'

function onPropsChange (props, onData) {
  Meteor.subscribe('currentUserDetails')
  const user = Meteor.user()
  onData(null, {user, accessKey: props.accessKey})
}

let userEmailIsVerified = function (user) {
  let isVerified = false
  if (user.registered_emails) {
    user.registered_emails.forEach(function (email) {
      if (email.verified) {
        isVerified = true
      }
    })
  }
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
  constructor (props) {
    super(props)
    this.state = {
      accessCheckResult: {
        route: null,
        result: false
      }
    }
    // TODO onLogout delete accessCheckResult
  }
  componentDidMount () {
    // Use Meteor Blaze to render the consent form
    /* this.cookieConsentView = Blaze.render(Template.cookieConsentImply,
      ReactDOM.findDOMNode(this.refs.cookieConsentForm))*/
    this.statusView = Blaze.render(Template.status,
      ReactDOM.findDOMNode(this.refs.status))
    setTimeout(function () {
      try {
        // Blaze.remove(this.cookieConsentView)
        Blaze.remove(this.statusView)
      } catch (e) {
        //
      }
    }, 30000)
  }
  componentWillUnmount () {
    // Clean up Blaze view
    try {
      // Blaze.remove(this.cookieConsentView)
      Blaze.remove(this.statusView)
    } catch (e) {
      //
    }
  }
  render () {
    // <div ref='cookieConsentForm'></div>
    let { user, isPublic, requiredRoles, tosNotNeeded, canRequestAccess } = this.props
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
    return (
      <div>
        <div ref='status'></div>
        <header>
          {this.props.header}
        </header>
        <main>
          {isPublic && !user ? <div>{this.props.content}{this.props.helpCenter}</div> : <div>
            {!user ? <Login /> : <div>
              {isAllowedToEnterRoute ? <div>
                {isVerified && acceptedTermsOfService || tosNotNeeded ? <div>{this.props.content}{this.props.helpCenter}</div> : (
                  <VerificationAndTOSInterceptor
                    acceptedTermsOfService={acceptedTermsOfService}
                    isVerified={isVerified}
                    registeredEmails={user.registered_emails} />
                )}
              </div> : <div>
                {canRequestAccess ? <div className='container'>Request access</div> : <div className='container'>
                  <div className='panel panel-danger'>
                    <div className='panel-heading'><h2>Access Forbidden</h2></div>
                    <div className='panel-body'>
                      <div className='access-forbidden-panel-content-wrapper'>
                        <img src='/stop-sign-35069.svg' alt='Stop Sign' />
                        {'You don\'t have permission to be here...'}
                      </div>
                    </div>
                  </div>
                </div>}
              </div>}
            </div>}
          </div>}
        </main>
        <LDSidebar />
        <Alert stack={{limit: 3, spacing: 10}} position='bottom-left' offset={50} />
      </div>
    )
  }
}

MainLayout.propTypes = {
  user: React.PropTypes.object,
  isPublic: React.PropTypes.bool,
  requiredRoles: React.PropTypes.array,
  tosNotNeeded: React.PropTypes.bool,
  canRequestAccess: React.PropTypes.bool,
  header: React.PropTypes.object,
  content: React.PropTypes.object,
  helpCenter: React.PropTypes.object
}

export default composeWithTracker(onPropsChange)(MainLayout)
