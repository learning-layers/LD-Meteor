import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import { compose } from 'react-komposer'
import Checkbox from '../../../../../node_modules/react-bootstrap/lib/Checkbox'
import DropdownButton from '../../../../../node_modules/react-bootstrap/lib/DropdownButton'
import MenuItem from '../../../../../node_modules/react-bootstrap/lib/MenuItem'
import { NotificationSettings, emailIntervalOptions } from '../../lib/collections'
import { Tracker } from 'meteor/tracker'

function getTrackerLoader (reactiveMapper) {
  return (props, onData, env) => {
    let trackerCleanup = null
    const handler = Tracker.nonreactive(() => {
      return Tracker.autorun(() => {
        // assign the custom clean-up function.
        trackerCleanup = reactiveMapper(props, onData, env)
      })
    })

    return () => {
      if (typeof trackerCleanup === 'function') trackerCleanup()
      return handler.stop()
    }
  }
}

let emailIntervalOptionsMap = []
emailIntervalOptionsMap['instantly'] = {label: 'instantly', key: 'instantly'}
emailIntervalOptionsMap['hourly'] = {label: 'hourly', key: 'hourly'}
emailIntervalOptionsMap['twohourly'] = {label: 'every two hours', key: 'twohourly'}
emailIntervalOptionsMap['fourhourly'] = {label: 'every four hours', key: 'fourhourly'}
emailIntervalOptionsMap['daily'] = {label: 'daily', key: 'daily'}
emailIntervalOptionsMap['weeklymon'] = {label: 'weekly monday', key: 'weeklymon'}
emailIntervalOptionsMap['weeklyfri'] = {label: 'weekly friday', key: 'weeklyfri'}
emailIntervalOptionsMap['weeklywed'] = {label: 'weekly wednesday', key: 'weeklywed'}

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('notificationSettings')
  if (handle.ready()) {
    let notificationSettings = NotificationSettings.find({userId: Meteor.userId()}).fetch()
    onData(null, { notificationSettings })
  }
}

class NotificationSettingsUI extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentEmailOption: {label: 'instantly', key: 'instantly'}
    }
  }
  setEmailOptionTo (newEmailOption) {
    window.alert('New email option chosen=' + newEmailOption.label)
    this.setState({
      currentEmailOption: newEmailOption
    })
  }
  changeNotificationSetting (notificationName, on, intervalKey, additionalValues) {
    if (additionalValues) {
      Meteor.call('changeNotificationSetting', notificationName, on, intervalKey, additionalValues)
    } else {
      Meteor.call('changeNotificationSetting', notificationName, on, intervalKey)
    }
  }
  render () {
    const { notificationSettings } = this.props
    let notificationSettingsMap = []
    notificationSettings.forEach(function (notificationSettings) {
      notificationSettingsMap[notificationSettings.messageId] = notificationSettings
    })
    let groupAutoSubscribeToChannels = false
    if (notificationSettingsMap['groupChatAutoSubscribe']) {
      try {
        let parsedAdditionalValues = JSON.parse(notificationSettingsMap['groupChatAutoSubscribe'].additionalValues)
        groupAutoSubscribeToChannels = parsedAdditionalValues.autosubscribeToChannels
      } catch (e) {
        console.error(e)
      }
    }
    return <div className='notification-settings container'>
      <h2>Notification settings</h2>
      <i>Here you can determine for which actions in the system you want to only receive in-app or additional email notifications.</i>
      <br /><br />
      <span style={{color: 'red'}}><i>Emails in queue can take up to 5 mins. till they arrive.</i></span>
      <br /><br />
      <h3>Documents</h3>
      <hr />
      <table className='table table-bordered table-striped table-hover table-condensed'>
        <thead>
          <tr>
            <th>Message type</th>
            <th>email</th>
          </tr>
        </thead>
        <tbody>
          {notificationSettingsMap['docCommentMentions'] ? <tr>
            <td>
              Comments where your name is mentioned via @&lt;your-username&gt;.
            </td>
            <td style={{width: '200px'}}>
              <Checkbox checked={notificationSettingsMap['docCommentMentions'].on} style={{display: 'inline-block'}} onChange={() => this.changeNotificationSetting('docCommentMentions', !notificationSettingsMap['docCommentMentions'].on, emailIntervalOptionsMap[notificationSettingsMap['docCommentMentions'].intervalKey].key)} />
              <DropdownButton bsStyle='default' bsSize='small' title={emailIntervalOptionsMap[notificationSettingsMap['docCommentMentions'].intervalKey].label} key='dropdown-basic-filter' className='dropdown-basic-filter' style={{display: 'inline-block'}} dropup>
                {emailIntervalOptions.map((emailOption, i) => {
                  return <MenuItem
                    eventKey={i}
                    key={'emailOption-' + emailOption.key}
                    active={emailOption.key === emailIntervalOptionsMap[notificationSettingsMap['docCommentMentions'].intervalKey].key}
                    onClick={() => this.changeNotificationSetting('docCommentMentions', notificationSettingsMap['docCommentMentions'].on, emailOption.key)}>
                    {emailOption.label}
                  </MenuItem>
                })}
              </DropdownButton>
            </td>
          </tr> : null}
        </tbody>
      </table>
      <h3>Document subscriptions</h3>
      <hr />
      <table className='table table-bordered table-striped table-hover table-condensed'>
        <thead>
          <tr>
            <th>Message type</th>
            <th>email</th>
          </tr>
        </thead>
        <tbody>
          {notificationSettingsMap['docContentChange'] ? <tr>
            <td>
              Document content change notifications
            </td>
            <td style={{width: '200px'}}>
              <Checkbox checked={notificationSettingsMap['docContentChange'].on} style={{display: 'inline-block'}} onChange={() => this.changeNotificationSetting('docContentChange', !notificationSettingsMap['docContentChange'].on, emailIntervalOptionsMap[notificationSettingsMap['docContentChange'].intervalKey].key)} />
              <DropdownButton bsStyle='default' bsSize='small' title={emailIntervalOptionsMap[notificationSettingsMap['docContentChange'].intervalKey].label} key='dropdown-basic-filter' className='dropdown-basic-filter' style={{display: 'inline-block'}} dropup>
                {emailIntervalOptions.map((emailOption, i) => {
                  return <MenuItem
                    eventKey={i}
                    key={'emailOption-' + emailOption.key}
                    active={emailOption.key === emailIntervalOptionsMap[notificationSettingsMap['docContentChange'].intervalKey].key}
                    onClick={() => this.changeNotificationSetting('docContentChange', notificationSettingsMap['docContentChange'].on, emailOption.key)}>
                    {emailOption.label}
                  </MenuItem>
                })}
              </DropdownButton>
            </td>
          </tr> : null}
          {notificationSettingsMap['docNewComment'] ? <tr>
            <td>
              New comments for a document
            </td>
            <td style={{width: '200px'}}>
              <Checkbox checked={notificationSettingsMap['docNewComment'].on} style={{display: 'inline-block'}} onChange={() => this.changeNotificationSetting('docNewComment', !notificationSettingsMap['docNewComment'].on, emailIntervalOptionsMap[notificationSettingsMap['docNewComment'].intervalKey].key)} />
              <DropdownButton bsStyle='default' bsSize='small' title={emailIntervalOptionsMap[notificationSettingsMap['docNewComment'].intervalKey].label} key='dropdown-basic-filter' className='dropdown-basic-filter' style={{display: 'inline-block'}} dropup>
                {emailIntervalOptions.map((emailOption, i) => {
                  return <MenuItem
                    eventKey={i}
                    key={'emailOption-' + emailOption.key}
                    active={emailOption.key === emailIntervalOptionsMap[notificationSettingsMap['docNewComment'].intervalKey].key}
                    onClick={() => this.changeNotificationSetting('docNewComment', notificationSettingsMap['docNewComment'].on, emailOption.key)}>
                    {emailOption.label}
                  </MenuItem>
                })}
              </DropdownButton>
            </td>
          </tr> : null}
          {notificationSettingsMap['docNewSubdocument'] ? <tr>
            <td>
              New subdocuments that have been created
            </td>
            <td style={{width: '200px'}}>
              <Checkbox checked={notificationSettingsMap['docNewSubdocument'].on} style={{display: 'inline-block'}} onChange={() => this.changeNotificationSetting('docNewSubdocument', !notificationSettingsMap['docNewSubdocument'].on, emailIntervalOptionsMap[notificationSettingsMap['docNewSubdocument'].intervalKey].key)} />
              <DropdownButton bsStyle='default' bsSize='small' title={emailIntervalOptionsMap[notificationSettingsMap['docNewSubdocument'].intervalKey].label} key='dropdown-basic-filter' className='dropdown-basic-filter' style={{display: 'inline-block'}} dropup>
                {emailIntervalOptions.map((emailOption, i) => {
                  return <MenuItem
                    eventKey={i}
                    key={'emailOption-' + emailOption.key}
                    active={emailOption.key === emailIntervalOptionsMap[notificationSettingsMap['docNewSubdocument'].intervalKey].key}
                    onClick={() => this.changeNotificationSetting('docNewSubdocument', notificationSettingsMap['docNewSubdocument'].on, emailOption.key)}>
                    {emailOption.label}
                  </MenuItem>
                })}
              </DropdownButton>
            </td>
          </tr> : null}
          {notificationSettingsMap['docNewAttachment'] ? <tr>
            <td>
              New attachments that have been uploaded
            </td>
            <td style={{width: '200px'}}>
              <Checkbox checked={notificationSettingsMap['docNewAttachment'].on} style={{display: 'inline-block'}} onChange={() => this.changeNotificationSetting('docNewAttachment', !notificationSettingsMap['docNewAttachment'].on, emailIntervalOptionsMap[notificationSettingsMap['docNewAttachment'].intervalKey].key)} />
              <DropdownButton bsStyle='default' bsSize='small' title={emailIntervalOptionsMap[notificationSettingsMap['docNewAttachment'].intervalKey].label} key='dropdown-basic-filter' className='dropdown-basic-filter' style={{display: 'inline-block'}} dropup>
                {emailIntervalOptions.map((emailOption, i) => {
                  return <MenuItem
                    eventKey={i}
                    key={'emailOption-' + emailOption.key}
                    active={emailOption.key === emailIntervalOptionsMap[notificationSettingsMap['docNewAttachment'].intervalKey].key}
                    onClick={() => this.changeNotificationSetting('docNewAttachment', notificationSettingsMap['docNewAttachment'].on, emailOption.key)}>
                    {emailOption.label}
                  </MenuItem>
                })}
              </DropdownButton>
            </td>
          </tr> : null}
        </tbody>
      </table>
      <h3 style={{display: 'none'}}>Chat</h3>
      <hr style={{display: 'none'}} />
      <h4 style={{display: 'none'}}>Direct chat (one-to-one, Friendlist)</h4>
      <table style={{display: 'none'}} className='table table-bordered table-striped table-hover table-condensed'>
        <thead>
          <tr>
            <th>Message type</th>
            <th>email</th>
          </tr>
        </thead>
        <tbody>
          {notificationSettingsMap['directChatNewMsg'] ? <tr>
            <td>
              New chat message from someone in your contact list
            </td>
            <td style={{width: '200px'}}>
              <Checkbox checked={notificationSettingsMap['directChatNewMsg'].on} style={{display: 'inline-block'}} onChange={() => this.changeNotificationSetting('directChatNewMsg', !notificationSettingsMap['directChatNewMsg'].on, emailIntervalOptionsMap[notificationSettingsMap['directChatNewMsg'].intervalKey].key)} />
              <DropdownButton bsStyle='default' bsSize='small' title={emailIntervalOptionsMap[notificationSettingsMap['directChatNewMsg'].intervalKey].label} key='dropdown-basic-filter' className='dropdown-basic-filter' style={{display: 'inline-block'}} dropup>
                {emailIntervalOptions.map((emailOption, i) => {
                  return <MenuItem
                    eventKey={i}
                    key={'emailOption-' + emailOption.key}
                    active={emailOption.key === emailIntervalOptionsMap[notificationSettingsMap['directChatNewMsg'].intervalKey].key}
                    onClick={() => this.changeNotificationSetting('directChatNewMsg', notificationSettingsMap['directChatNewMsg'].on, emailOption.key)}>{emailOption.label}
                  </MenuItem>
                })}
              </DropdownButton>
            </td>
          </tr> : null}
        </tbody>
      </table>
      <h4 style={{display: 'none'}}>Group chat</h4>
      <table style={{display: 'none'}} className='table table-bordered table-striped table-hover table-condensed'>
        <thead>
          <tr>
            <th />
            <th>yes</th>
            <th>email</th>
          </tr>
        </thead>
        <tbody>
          {notificationSettingsMap['groupChatAutoSubscribe'] ? <tr>
            <td>
              Automatically subscribe to all new group chat channels of your groups
            </td>
            <td>
              <Checkbox checked={groupAutoSubscribeToChannels} style={{display: 'inline-block'}} onChange={() => {
                try {
                  let parsedAdditionalValues = JSON.parse(notificationSettingsMap['groupChatAutoSubscribe'].additionalValues)
                  console.log(parsedAdditionalValues)
                  if (parsedAdditionalValues.autosubscribeToChannels) {
                    parsedAdditionalValues.autosubscribeToChannels = false
                  } else {
                    parsedAdditionalValues.autosubscribeToChannels = true
                  }
                  this.changeNotificationSetting(
                    'groupChatAutoSubscribe',
                    notificationSettingsMap['groupChatAutoSubscribe'].on,
                    emailIntervalOptionsMap[notificationSettingsMap['groupChatAutoSubscribe'].intervalKey].key,
                    JSON.stringify(parsedAdditionalValues)
                  )
                } catch (e) {
                  console.error(e)
                }
              }} />
            </td>
            <td style={{width: '200px'}}>
              <Checkbox checked={notificationSettingsMap['groupChatAutoSubscribe'].on} style={{display: 'inline-block'}} onChange={() => this.changeNotificationSetting('groupChatAutoSubscribe', !notificationSettingsMap['groupChatAutoSubscribe'].on, emailIntervalOptionsMap[notificationSettingsMap['groupChatAutoSubscribe'].intervalKey].key)} />
              <DropdownButton
                bsStyle='default'
                bsSize='small'
                title={emailIntervalOptionsMap[notificationSettingsMap['groupChatAutoSubscribe'].intervalKey].label}
                key='dropdown-basic-filter'
                className='dropdown-basic-filter'
                style={{display: 'inline-block'}}
                dropup>
                {emailIntervalOptions.map((emailOption, i) => {
                  return <MenuItem
                    eventKey={i}
                    key={'emailOption-' + emailOption.key}
                    active={emailOption.key === emailIntervalOptionsMap[notificationSettingsMap['groupChatAutoSubscribe'].intervalKey].key}
                    onClick={() => this.changeNotificationSetting('groupChatAutoSubscribe', notificationSettingsMap['groupChatAutoSubscribe'].on, emailOption.key)}>
                    {emailOption.label}
                  </MenuItem>
                })}
              </DropdownButton>
            </td>
          </tr> : null}
        </tbody>
      </table>
    </div>
  }
}

export default compose(getTrackerLoader(onPropsChange))(NotificationSettingsUI)
