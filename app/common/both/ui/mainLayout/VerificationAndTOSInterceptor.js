import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import Alert from 'react-s-alert'

class VerifyEmailAddressPanel extends Component {
  resendVerificationEmail (address) {
    var result = global.confirm('Do you want to send a verification email to ' + address + '?')
    if (result) {
      Meteor.call('resendUserVerificationMail', Meteor.userId(), address)
    }
  }
  render () {
    const { registeredEmails } = this.props
    return <div id='ld-verify-email-panel' className='panel panel-default'>
      <div className='panel-heading'>Verify one of your email addresses</div>
      <div className='panel-body'>
        <table className='table table-striped table-bordered table-hover'>
          <thead>
            <th>Address</th>
            <th>Verification Status</th>
          </thead>
          <tbody>
            {registeredEmails.map((registeredEmail) => {
              return <tr key={'registered-email-' + registeredEmail.address}>
                <td>{registeredEmail.address}</td>
                <td>
                  {registeredEmail.verified ? 'verified' : <span>
                    <div className='status-indicator-base not-verified'></div>
                    <button className='btn btn-default' onClick={() => this.resendVerificationEmail(registeredEmail.address)}>Send verification email</button>
                  </span>}
                </td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
    </div>
  }
}

VerifyEmailAddressPanel.propTypes = {
  registeredEmails: React.PropTypes.array
}

class TermsOfService extends Component {
  agreeToTOS () {
    var result = global.confirm('Do you want to agree to the Terms of Service?')
    if (result) {
      Meteor.call('agreeToTOS', function (err, res) {
        if (err) {
          Alert.error('Error: Agreeing to our Terms of Service failed!')
        } else {
          Alert.success('Success: Agreeing to our Terms of Service')
        }
      })
    }
  }
  render () {
    const { acceptedTermsOfService } = this.props
    return <div className='panel panel-default'>
      <div className='panel-heading'>Agree to our Terms of Service</div>
      <div className='panel-body'>
        {acceptedTermsOfService ? 'You have agreed to our Terms of Service' : <div>
          <b>Terms of Service</b>
          <br />
          TOS placeholder
          <br /><br />
          <button onClick={() => this.agreeToTOS()}>Agree to TOS</button>
        </div>}
      </div>
    </div>
  }
}

TermsOfService.propTypes = {
  acceptedTermsOfService: React.PropTypes.bool
}

class VerificationAndTOSInterceptor extends Component {
  render () {
    const { isVerified, acceptedTermsOfService, registeredEmails } = this.props
    let totalSteps = 3
    let stepsLeftToEnterTheSystemCount = 0
    isVerified ? null : stepsLeftToEnterTheSystemCount++
    acceptedTermsOfService ? null : stepsLeftToEnterTheSystemCount++
    let stepsDone = totalSteps - stepsLeftToEnterTheSystemCount
    let currentProgressPercentage = Math.floor((stepsDone / totalSteps) * 100)
    return <div className='ld-verify-and-tos container'>
      {stepsLeftToEnterTheSystemCount === 0 ? null : <div className='well'>
        <div className='steps-left-message'>
          You successfully logged in!
          <br /><br />
          {stepsLeftToEnterTheSystemCount === 1 ? 'There is ' : 'There are '}
          only <b>{stepsLeftToEnterTheSystemCount}</b>
          {stepsLeftToEnterTheSystemCount === 1 ? ' step ' : ' steps '}
          left to get started! ({stepsDone}/{totalSteps})
        </div>
        <div className='progress'>
          <div className='progress-bar progress-bar-success' role='progressbar' aria-valuenow={stepsLeftToEnterTheSystemCount / totalSteps} aria-valuemin='0' aria-valuemax='100' style={{width: currentProgressPercentage + '%'}}>
            <span className='sr-only'>60% Complete</span>
          </div>
        </div>
      </div>}
      {isVerified ? null : <VerifyEmailAddressPanel registeredEmails={registeredEmails} />}
      {acceptedTermsOfService ? null : <TermsOfService acceptedTermsOfService={acceptedTermsOfService} />}
    </div>
  }
}

VerificationAndTOSInterceptor.propTypes = {
  isVerified: React.PropTypes.bool,
  acceptedTermsOfService: React.PropTypes.bool,
  registeredEmails: React.PropTypes.array
}

export default VerificationAndTOSInterceptor
