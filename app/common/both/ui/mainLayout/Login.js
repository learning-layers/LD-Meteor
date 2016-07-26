import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import Col from '../../../../../node_modules/react-bootstrap/lib/Col'

class Login extends Component {
  loginSubmitHandler (event) {
    event.preventDefault()
    var emailVar = event.target.loginEmail.value
    var passwordVar = event.target.loginPassword.value
    Meteor.loginWithPassword(emailVar, passwordVar)
  }
  socialLoginClickHandler (event) {
    event.preventDefault()
    const service = event.target.getAttribute('data-social-login')
    const options = {
      requestPermissions: [ 'email' ]
    }
    Meteor[service](options, (error) => {
      if (error) {
        window.alert(error.message)
      }
    })
  }
  submitRegisterForm (event) {
    event.preventDefault()
    var emailVar = event.target.registerEmail.value
    var passwordVar = event.target.registerPassword.value
    Accounts.createUser({
      email: emailVar,
      password: passwordVar
    }, function (err) {
      if (err) {
        console.error(err)
        window.alert(err)
      }
    })
  }
  render () {
    return <div className='login container'>
      <Col xs={12} md={6}>
        <div className='well'>
          <h3>Sign In to LD</h3>
          <form onSubmit={(event) => this.loginSubmitHandler(event)}>
            <input className='form-control' type='email' name='loginEmail' placeholder='Your email address' required />
            <input className='form-control' type='password' name='loginPassword' placeholder='Your password' required />
            <button className='btn btn-success login-btn'>Login</button>
          </form>
        </div>
        <hr />
        <div className='well'>
          <form onSubmit={(event) => this.submitRegisterForm(event)}>
            <input className='form-control' type='email' name='registerEmail' placeholder='Your email address' required />
            <input className='form-control' id='password' name='registerPassword' type='password' pattern='^\S{6,}$'
              onchange='this.setCustomValidity(this.validity.patternMismatch ? "Must have at least 6 characters" : ""); if(this.checkValidity()) form.password_two.pattern = this.value;'
              placeholder='Your password' required />
            <input className='form-control' id='password_two' name='password_two' type='password' pattern='^\S{6,}$'
              onchange='this.setCustomValidity(this.validity.patternMismatch ? "Please enter the same Password as above" : "");'
              placeholder='Verify your password' required />
            <button className='btn btn-info register-btn'>Register</button>
          </form>
        </div>
      </Col>
      <Col xs={12} md={6}>
        <ul className='btn-list'>
          <li>
            <div className='box'>
              <button data-social-login='loginWithLearninglayers' type='button' className='btn' onClick={(event) => this.socialLoginClickHandler(event)}>
                <img className='ld-login-btn-logo' src='/logo_grey.png?v=3' alt='Learning Layers logo' /> Sign in with Learning Layers
              </button>
            </div>
          </li>
          <li>
            <button data-social-login='loginWithGoogle' type='button' className='btn' onClick={(event) => this.socialLoginClickHandler(event)}>
              <i className='fa fa-google' /> Sign in with Google
            </button>
          </li>
          <li>
            <button data-social-login='loginWithFacebook' type='button' className='btn' onClick={(event) => this.socialLoginClickHandler(event)}>
              <i className='fa fa-facebook' /> Sign in with Facebook
            </button>
          </li>
        </ul>
      </Col>
    </div>
  }
}

export default Login
