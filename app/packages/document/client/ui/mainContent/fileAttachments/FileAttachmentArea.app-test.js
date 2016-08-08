/* eslint-env mocha */

import FileAttachmentArea from './FileAttachmentArea'
import React from 'react'
import { Meteor } from 'meteor/meteor'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import { chai } from 'meteor/practicalmeteor:chai'
import { $ } from 'meteor/jquery'
import { getReactKomposerInstance } from '../../../../../../common/lib/utils'

process.env.NODE_ENV = 'production'

global.loadingSpinner = {
  options: {
    lines: 13,
    length: 20,
    width: 10,
    radius: 30,
    corners: 1,
    rotate: 0,
    direction: 1,
    color: '#000',
    speed: 1,
    trail: 60,
    shadow: false,
    hwaccel: false,
    zIndex: 2e9,
    top: '50%',
    left: '50%',
    scale: 1.00
  }
}

let renderComponent = function (comp, props) {
  return TestUtils.renderIntoDocument(
    React.createElement(comp, props)
  )
}

let hasClass = function (element, cls) {
  return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1
}

let simulateClickOn = function ($el) {
  TestUtils.Simulate.click($el[0])
}

describe('document/mainContent/fileAttachments/FileAttachmentArea', function () {
  before(function (done) {
    let loginWithPassword = Meteor.wrapAsync(Meteor.loginWithPassword)
    if (!Meteor.userId()) {
      try {
        let result = loginWithPassword('martin@bachl.pro', 'changeme1')
        console.log(result)
      } catch (loginErr) {
        console.error(JSON.stringify(loginErr))
        done(loginErr)
      }
    }
    let loginWaitCounter = 0
    let interval = setInterval(function () {
      if (loginWaitCounter < 20) {
        if (Meteor.userId() !== null) {
          clearInterval(interval)
          done()
        } else {
          loginWaitCounter++
        }
      } else {
        clearInterval(interval)
        done(new Error('login failed'))
      }
    }, 200)
  })

  it('does render', function (done) {
    let componentWrapper = renderComponent(FileAttachmentArea, { documentId: 'testDocumentId' })
    Meteor.setTimeout(function () {
      try {
        let component = getReactKomposerInstance(componentWrapper)
        console.log('component=')
        console.log(component)
        let el = ReactDOM.findDOMNode(component)
        console.log('el=')
        console.log(el)
        let hasClassResult = hasClass(el, 'file-attachments')
        chai.assert.equal(hasClassResult, true)
        done()
      } catch (e) {
        console.error(JSON.stringify(e))
        done(e)
      }
    }, 1500)
  })

  it('opens on click', function (done) {
    let componentWrapper = renderComponent(FileAttachmentArea, { documentId: 'testDocumentId' })
    Meteor.setTimeout(function () {
      try {
        let component = getReactKomposerInstance(componentWrapper)
        let el = ReactDOM.findDOMNode(component)
        let $el = $(el).find('#open-close-file-upload')
        chai.assert.equal(component.state.open, false)
        simulateClickOn($el)
        chai.assert.equal(component.state.open, true)
        done()
      } catch (e) {
        console.error(JSON.stringify(e))
        done(e)
      }
    }, 1500)
  })

  it('closes on click', function (done) {
    let componentWrapper = renderComponent(FileAttachmentArea, { documentId: 'testDocumentId' })
    Meteor.setTimeout(function () {
      try {
        let component = getReactKomposerInstance(componentWrapper)
        let el = ReactDOM.findDOMNode(component)
        let $el = $(el).find('#open-close-file-upload')
        chai.assert.equal(component.state.open, false)
        simulateClickOn($el)
        chai.assert.equal(component.state.open, true)
        simulateClickOn($el)
        chai.assert.equal(component.state.open, false)
        done()
      } catch (e) {
        console.error(JSON.stringify(e))
        done(e)
      }
    }, 1500)
  })
})
