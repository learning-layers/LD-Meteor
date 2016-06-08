import React, { Component } from 'react'

class VerificationAndTOSInterceptor extends Component {
  render () {
    let { isVerified } = this.props
    return <div className='ld-verify-and-tos'>
      Verification and TOS interceptor
      {isVerified ? 'You have a verified email address' : 'Your email address in not verified'}
    </div>
  }
}

export default VerificationAndTOSInterceptor
