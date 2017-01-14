import { Meteor } from 'meteor/meteor'
import React, { Component } from 'react'

class TinyMce extends Component {
  componentDidMount () {
    Meteor.setTimeout(function () {
      global.tinymce.init({
        selector: '#tinymceTextarea',
        skin_url: '/packages/teamon_tinymce/skins/lightgray',
        plugins: 'print',
        content_security_policy: 'default-src \'self\''
      })
    }, 1000)
  }
  componentWillUnmount () {
    Meteor.setTimeout(function () {
      global.tinymce.execCommand('mceRemoveControl', true, 'tinymceTextarea')
    }, 0)
  }
  render () {
    return (
      <textarea id='tinymceTextarea' name='tinymceTextarea' />
    )
  }
}

export default TinyMce
