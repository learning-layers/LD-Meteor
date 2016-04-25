import HelpCenter from './HelpCenter';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { chai } from 'meteor/practicalmeteor:chai';

let renderComponent = function (comp, props) {
  return TestUtils.renderIntoDocument(
    React.createElement(comp, props)
  );
};

let simulateClickOn = function($el) {
  React.addons.TestUtils.Simulate.click($el[0]);
};

describe('help center', function () {
  beforeEach(function() {
    defProps = {
      number: 2
    };
  });

  it('does render', function () {
    let component = renderComponent(HelpCenter, {});
    console.debug(component);
    let el = ReactDOM.findDOMNode(component);
    console.debug(el);
    let $el = $(el).find('#ld-helpcenter');
    console.debug($el);
    chai.assert.equal($el.text(), 'Help Center');
  });
});