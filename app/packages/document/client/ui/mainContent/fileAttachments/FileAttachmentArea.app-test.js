/* eslint-env mocha */

import FileAttachmentArea from './FileAttachmentArea'
import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import { chai } from 'meteor/practicalmeteor:chai'
import { $ } from 'meteor/jquery'
import { getReactKomposerInstance } from '../../../../../../common/lib/utils'

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
  it('does render', function () {
    let component = renderComponent(FileAttachmentArea, {})
    let el = ReactDOM.findDOMNode(component)
    let hasClassResult = hasClass(el, 'file-attachments')
    chai.assert.equal(hasClassResult, true)
  })

  it('opens on click', function () {
    let component = getReactKomposerInstance(renderComponent(FileAttachmentArea, {}))
    let el = ReactDOM.findDOMNode(component)
    let $el = $(el).find('#open-close-file-upload')
    chai.assert.equal(component.state.open, false)
    simulateClickOn($el)
    chai.assert.equal(component.state.open, true)
  })

  it('closes on click', function () {
    let component = getReactKomposerInstance(renderComponent(FileAttachmentArea, {}))
    let el = ReactDOM.findDOMNode(component)
    let $el = $(el).find('#open-close-file-upload')
    chai.assert.equal(component.state.open, false)
    simulateClickOn($el)
    chai.assert.equal(component.state.open, true)
    simulateClickOn($el)
    chai.assert.equal(component.state.open, false)
  })
})
