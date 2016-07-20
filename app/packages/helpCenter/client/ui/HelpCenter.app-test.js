/* eslint-env mocha */

import HelpCenter from './HelpCenter'
import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import { chai } from 'meteor/practicalmeteor:chai'
import { $ } from 'meteor/jquery'

let renderComponent = function (comp, props) {
  return TestUtils.renderIntoDocument(
    React.createElement(comp, props)
  )
}

let simulateClickOn = function ($el) {
  TestUtils.Simulate.click($el[0])
}

let RBFormControlSimulateChangeOn = function (component, $el, value) {
  let node = component.refs.filterTourInput
  let $node = ReactDOM.findDOMNode(node)
  $node.value = value
  TestUtils.Simulate.change($node)
}

describe('helpCenter/HelpCenter', function () {
  beforeEach(function () {
    let exampleTourList = global.exampleTourList = []
    let exampleTour1 = {
      label: 'Tour 1',
      hopscotchConfig: {
        id: 'hello-hopscotch',
        steps: [
          {
            title: 'My Header',
            content: 'This is the header of my page.',
            target: 'header',
            placement: 'bottom'
          },
          {
            title: 'My content',
            content: 'Here is where I put my content.',
            target: 'main',
            placement: 'bottom'
          }
        ]
      }
    }
    exampleTourList.push(exampleTour1)
    let exampleTour2 = {
      label: 'Tour 2',
      hopscotchConfig: {
        id: 'hello-hopscotch',
        steps: [
          {
            title: 'My Header',
            content: 'This is the header of my page.',
            target: 'header',
            placement: 'bottom'
          },
          {
            title: 'My content',
            content: 'Here is where I put my content.',
            target: 'main',
            placement: 'bottom'
          }
        ]
      }
    }
    exampleTourList.push(exampleTour2)
    global.defProps = {helpTours: exampleTourList}
  })

  it('does render', function () {
    let component = renderComponent(HelpCenter, global.defProps)
    let el = ReactDOM.findDOMNode(component)
    let $el = $(el).find('#ld-helpcenter')
    chai.assert.equal($el.text(), 'Help Center')
  })

  it('opens on click', function () {
    let component = renderComponent(HelpCenter, global.defProps)
    let el = ReactDOM.findDOMNode(component)
    let $el = $(el).find('#ld-helpcenter')
    chai.assert.equal(component.state.isOpened, false)
    simulateClickOn($el)
    chai.assert.equal(component.state.isOpened, true)
  })

  it('renders the list of tours', function () {
    let component = renderComponent(HelpCenter, global.defProps)
    let el = ReactDOM.findDOMNode(component)
    let $el = $(el).find('#ld-helpcenter')
    simulateClickOn($el)
    let $elArray = $(el).find('ul.ld-help-center-menu.ld-help-center-submenu li')
    chai.assert.equal($($elArray[0]).find('a').text(), global.exampleTourList[0].label)
    chai.assert.equal($($elArray[1]).find('a').text(), global.exampleTourList[1].label)
  })

  it('filters the list of tours', function () {
    let component = renderComponent(HelpCenter, global.defProps)
    let el = ReactDOM.findDOMNode(component)
    let $el = $(el).find('#ld-helpcenter')
    simulateClickOn($el)
    let $elArray = $(el).find('ul.ld-help-center-menu.ld-help-center-submenu li[role="presentation"]')
    chai.assert.equal($elArray.length, 2)
    RBFormControlSimulateChangeOn(component, $el, '1')
    $elArray = $(el).find('ul.ld-help-center-menu.ld-help-center-submenu li[role="presentation"]')
    chai.assert.equal($elArray.length, 1)
  })
})
