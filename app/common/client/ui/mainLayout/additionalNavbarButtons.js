import { Template } from 'meteor/templating'
import EventEmitterInstance from '../../EventEmitter'

Template._loginButtonsLoggedInDropdown.events({
  'click #login-buttons-edit-profile': function (event) {
    EventEmitterInstance.emit('sidebar-toggle', false)
  },
  'click #login-buttons-edit-groups': function (event) {
    EventEmitterInstance.emit('sidebar-toggle', false)
  }
})
