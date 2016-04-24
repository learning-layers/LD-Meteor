import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class MainLayout extends Component {
  componentDidMount() {
    // Use Meteor Blaze to render the consent form
    this.view = Blaze.render(Template.cookieConsentImply,
      ReactDOM.findDOMNode(this.refs.cookieConsentForm));
    setTimeout(function() {
      Blaze.remove(this.view);
    }, 30000);
  }
  componentWillUnmount() {
    // Clean up Blaze view
    Blaze.remove(this.view);
  }
  render() {
    return <div>
      <div ref="cookieConsentForm"></div>
      <header>
        {this.props.header}
      </header>
      <main>
        {this.props.content}
      </main>
    </div>
  }
}

export default MainLayout;