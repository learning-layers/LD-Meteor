import React, {Component} from 'react'
import Rcslider from 'rc-slider'

class NotificationSettings extends Component {
  constructor (props) {
    super(props)
    this.state = {
      min: 0,
      max: 3,
      value: 3
    }
  }
  onSliderChange (value) {
    this.setState({value: value})
  }
  tipFormatter (value) {
    switch (value) {
      case 0:
        // You won't receive any emails. Notifications are only visible inside this web application.
        return <div>I don't want any emails sent by the system.</div>
      case 1:
        // You will receive emails for actions were someone awaits a response of you.
        // Notification about subscriptions are only shown inside this web application.
        return <div>I only want emails where someone expects a quick response.</div>
      case 2:
        // All email notifications
        return <div>I want to get emails for all my subscriptions and user requests.</div>
      default:
        // Custom settings
        return <div>Custom</div>
    }
  }
  quickNotificationSettingsExplanation (value) {
    let optionOneClasses = ''
    let optionTwoClasses = ''
    let optionThreeClasses = ''
    let optionFourClasses = ''
    switch (value) {
      case 0:
        // You won't receive any emails. Notifications are only visible inside this web application.
        optionOneClasses = 'active'
        break
      case 1:
        // You will receive emails for actions were someone awaits a response of you.
        // Notification about subscriptions are only shown inside this web application.
        optionTwoClasses = 'active'
        break
      case 2:
        // All email notifications
        optionThreeClasses = 'active'
        break
      default:
        // Custom settings
        optionFourClasses = 'active'
        break
    }
    return <ul className='quick-notification-settings-explanation'>
      <li className={optionOneClasses} onClick={() => this.onSliderChange(0)}>
        <strong>1st Option:</strong> You won't receive any emails. Notifications are only visible inside this web application.
      </li>
      <li className={optionTwoClasses} onClick={() => this.onSliderChange(1)}>
        <strong>2nd Option:</strong> You will receive emails for actions were someone awaits a response of you. Notification about subscriptions are only shown inside this web application.
      </li>
      <li className={optionThreeClasses} onClick={() => this.onSliderChange(2)}>
        <strong>3rd Option:</strong> All email notifications. But you can set the interval for emails about subscription updates.
      </li>
      <li className={optionFourClasses} onClick={() => this.onSliderChange(3)}>
        <strong>4th Option:</strong> Customized (advanced settings)
      </li>
    </ul>
  }
  render () {
    return <div className='notification-settings container'>
      <h3>Notification Settings</h3>
      <div className='well'>
        <h4>Quick notification settings</h4>
        <hr style={{marginTop: '5px', marginBottom: '5px'}} />
        {this.quickNotificationSettingsExplanation(this.state.value)}
        <Rcslider dots tipFormatter={(value) => this.tipFormatter(value)} value={this.state.value} min={this.state.min} max={this.state.max} onChange={(value) => this.onSliderChange(value)} />
      </div>
      <div className='well'>
        <h5>Advanced Settings (Custom fine-tuned notification settings)</h5>
        <hr style={{marginTop: '5px', marginBottom: '5px'}} />
      </div>
    </div>
  }
}

export default NotificationSettings
