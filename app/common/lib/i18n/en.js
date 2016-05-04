const en = {
  main: {
    heading: 'Welcome to i18n demo',
    user: {
      greeting: 'Hello {{user.firstname}} {{user.middle}} {{user.lastname}}'
    },
    text: {
      one: 'Sample text without placeholders',
      two: 'Sample text with one placeholder: "{{text}}"',
      three: 'Sample text with one placeholder + html <strong>strong</strong> tag: "<strong>{{text}}</strong>"',
      four: 'Sample text with multiple placeholders. First: "{{first}}". Second: "{{second}}". Third: "{{third}}"'
    }
  },
  resetPasswordDialog: {
    title: 'Reset your password',
    newPassword: 'New password',
    newPasswordAgain: 'New Password (again)',
    cancel: 'Cancel',
    submit: 'Set password'
  },
  enrollAccountDialog: {
    title: 'Choose a password',
    newPassword: 'New password',
    newPasswordAgain: 'New Password (again)',
    cancel: 'Close',
    submit: 'Set password'
  },
  justVerifiedEmailDialog: {
    verified: 'Email address verified',
    dismiss: 'Dismiss'
  },
  loginButtonsMessagesDialog: {
    dismiss: 'Dismiss'
  },
  loginButtonsLoggedInDropdownActions: {
    password: 'Change password',
    signOut: 'Sign out'
  },
  loginButtonsLoggedOutDropdown: {
    signIn: 'Sign in',
    up: 'Join'
  },
  loginButtonsLoggedOutPasswordServiceSeparator: {
    or: 'or'
  },
  loginButtonsLoggedOutPasswordService: {
    create: 'Create',
    signIn: 'Sign in',
    forgot: 'Forgot password?',
    createAcc: 'Create account'
  },
  forgotPasswordForm: {
    email: 'Email',
    reset: 'Reset password',
    invalidEmail: 'Invalid email'
  },
  loginButtonsBackToLoginLink: {
    back: 'Cancel'
  },
  loginButtonsChangePassword: {
    submit: 'Change password',
    cancel: 'Cancel'
  },
  loginButtonsLoggedOutSingleLoginButton: {
    signInWith: 'Sign in with',
    configure: 'Configure'
  },
  loginButtonsLoggedInSingleLogoutButton: {
    signOut: 'Sign out'
  },
  loginButtonsLoggedOut: {
    noLoginServices: 'No login services configured'
  },
  loginFields: {
    usernameOrEmail: 'Username or Email',
    username: 'Username',
    email: 'Email',
    password: 'Password'
  },
  signupFields: {
    username: 'Username',
    email: 'Email',
    emailOpt: 'Email (optional)',
    password: 'Password',
    passwordAgain: 'Password (again)'
  },
  changePasswordFields: {
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    newPasswordAgain: 'New Password (again)'
  },
  infoMessages: {
    emailSent: 'Email sent',
    passwordChanged: 'Password changed'
  },
  errorMessages: {
    genericTitle: 'There was an error',
    userNotFound: 'User not found',
    invalidEmail: 'Invalid email',
    incorrectPassword: 'Incorrect password',
    usernameTooShort: 'Username must be at least 3 characters long',
    passwordTooShort: 'Password must be at least 6 characters long',
    passwordsDontMatch: 'Passwords don\'t match',
    newPasswordSameAsOld: 'New and old passwords must be different',
    signupsForbidden: 'Signups forbidden'
  }
}

export default en