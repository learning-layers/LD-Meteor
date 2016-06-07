import { Template } from 'meteor/templating'

Template._loginButtonsLoggedInDropdown.events({
  'click #login-buttons-edit-profile': function (event) {
    global.emitter.emit('sidebar-toggle', false)
  },
  'click #login-buttons-edit-settings': function (event) {
    global.emitter.emit('sidebar-toggle', false)
  }
})
