import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'

class VerifyEmailAddress extends Component {
  resendVerificationEmail (address) {
    var result = global.confirm('Do you want to send a verification email to ' + address + '?')
    if (result) {
      Meteor.call('resendUserVerificationMail', Meteor.userId(), address)
    }
  }
  render () {
    let { registeredEmails } = this.props
    return <div className='ld-verify-and-tos'>
      You have not yet verified one of the email addresses linked to this account. If you want to continue to use this platform please verified one of the following email addresses:
      {registeredEmails.map((registeredEmail) => {
        return <div key={'registered-email-' + registeredEmail.address}>
          Address: {registeredEmail.address}, VerificationStatus: {registeredEmail.verified ? 'verified' : <div>not verified <button onClick={() => this.resendVerificationEmail(registeredEmail.address)}>Resend verification email</button></div>}
        </div>
      })}
    </div>
  }
}

class VerificationAndTOSInterceptor extends Component {
  render () {
    let { isVerified, registeredEmails } = this.props
    return <div className='ld-verify-and-tos'>
      {isVerified ? 'You have a verified email address' : <VerifyEmailAddress registeredEmails={registeredEmails} />}
    </div>
  }
}

export default VerificationAndTOSInterceptor
