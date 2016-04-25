import React, {Component} from 'react';

class HelpCenter extends Component {
  constructor(props) {
    super(props);
    this.state = {isOpened: false};
  }
  helpCenterClickHandler(event) {
    this.setState({
      isOpened: !this.state.isOpened
    });
    event.preventDefault();
  }
  render() {
    return <div id="ld-helcenter-wrapper">
      <div id="ld-helpcenter" onClick={(event) => this.helpCenterClickHandler(event)}>
        Help Center
      </div>
      <div className="clearfix"></div>
      {this.state.isOpened ? <div id="ld-helpcenter-panel" className="col-xs-12 col-sm-11 col-md-8 col-lg-6">
      </div>: null}
    </div>
  }
}

export default HelpCenter;