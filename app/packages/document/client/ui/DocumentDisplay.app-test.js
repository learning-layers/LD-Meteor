/* eslint-env mocha */

import React from 'react'
import { Meteor } from 'meteor/meteor'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import { chai } from 'meteor/practicalmeteor:chai'
import { $ } from 'meteor/jquery'
import DocumentDisplay from './DocumentDisplay'

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
  chai.assert.equal(element !== undefined, true, 'element was undefined should have class=' + cls)
  return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1
}

let simulateClickOn = function ($el) {
  TestUtils.Simulate.click($el[0])
}

describe('document/DocumentDisplay default', function () {
  beforeEach(function () {
    let component = renderComponent(DocumentDisplay, {
      document: {
        _id: 'DocumentTestId',
        title: 'DocumentTestTitle',
        createdBy: 'TestUser'
      },
      documentAccess: {
        documentId: 'DocumentTestId',
        userCanEdit: [],
        userCanComment: [],
        userCanView: [],
        groupCanEdit: [],
        groupCanComment: [],
        groupCanView: []
      }
    })
    global.defComponent = component
  })

  it('does render', function () {
    let el = ReactDOM.findDOMNode(global.defComponent)
    let hasClassResult = hasClass(el, 'document')
    chai.assert.equal(hasClassResult, true)
  })

  it('has an attached AttachmentsBar', function (done) {
    let el = ReactDOM.findDOMNode(global.defComponent)
    Meteor.setTimeout(function () {
      try {
        let $el = $(el).find('.attachments-bar')
        let hasClassResult = hasClass($el[0], 'attachments-bar')
        chai.assert.equal(hasClassResult, true)
        done()
      } catch (e) {
        console.error(JSON.stringify(e))
        chai.assert.fail()
      }
    }, 1000)
  })

  it('switches to file attachments if the file icon is clicked', function (done) {
    let el = ReactDOM.findDOMNode(global.defComponent)
    Meteor.setTimeout(function () {
      try {
        let hasClassResult1 = hasClass(el, 'document')
        chai.assert.equal(hasClassResult1, true)
        let $attachmentsBarElements = $(el).find('.attachments-bar')
        let hasClassResult2 = hasClass($attachmentsBarElements[0], 'attachments-bar')
        chai.assert.equal(hasClassResult2, true)
        let $spanElements = $($attachmentsBarElements[0]).find('li.active span')
        console.log($spanElements)
        // check the current active tab
        let hasClassResult3 = hasClass($spanElements[0], 'glyphicon-pencil') // content editor is active
        chai.assert.equal(hasClassResult3, true)
        // change the tab via clicking the file icon
        let $liElements = $($attachmentsBarElements[0]).find('.files-tab-btn')
        let hasClassResult4 = hasClass($liElements[0], 'files-tab-btn')
        chai.assert.equal(hasClassResult4, true)
        simulateClickOn($($liElements[0]))
        // check if the active tab changed
        let $spanElements2 = $($attachmentsBarElements[0]).find('li.active span')
        let hasClassResult5 = hasClass($spanElements2[0], 'glyphicon-file') // file attachment tab is active
        chai.assert.equal(hasClassResult5, true)
        done()
      } catch (e) {
        console.error(JSON.stringify(e))
        chai.assert.fail()
      }
    }, 1000)
  })
})

describe('document/DocumentDisplay view mode', function () {
  beforeEach(function () {
    let viewModeComponent = renderComponent(DocumentDisplay, {
      document: {
        _id: 'DocumentTestId',
        title: 'DocumentTestTitle',
        createdBy: 'TestUser'
      },
      documentAccess: {
        documentId: 'DocumentTestId',
        userCanEdit: [],
        userCanComment: [],
        userCanView: [],
        groupCanEdit: [],
        groupCanComment: [],
        groupCanView: []
      },
      action: 'shared',
      permission: 'view',
      accessKey: 'testAccessKey'
    })
    global.defViewModeComponent = viewModeComponent
  })

  it('switches the content to the content viewer in view mode', function () {
    let el = ReactDOM.findDOMNode(global.defViewModeComponent)
    let $el = $(el).find('#content-viewer')
    chai.assert.equal($el[0].id === 'content-viewer', true)
  })
})

describe('document/DocumentDisplay edit mode', function () {
  beforeEach(function () {
    let editModeComponent = renderComponent(DocumentDisplay, {
      document: {
        _id: 'DocumentTestId',
        title: 'DocumentTestTitle',
        createdBy: 'TestUser'
      },
      documentAccess: {
        documentId: 'DocumentTestId',
        userCanEdit: [],
        userCanComment: [],
        userCanView: [],
        groupCanEdit: [],
        groupCanComment: [],
        groupCanView: []
      },
      action: 'shared',
      permission: 'edit',
      accessKey: 'testAccessKey'
    })
    global.defEditModeComponent = editModeComponent
  })

  it('switches the content to the content editor when in edit mode', function () {
    let el = ReactDOM.findDOMNode(global.defEditModeComponent)
    let $el = $(el).find('#content-editor')
    chai.assert.equal($el[0].id === 'content-editor', true)
  })
})
