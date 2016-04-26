import React, {Component} from 'react';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import Button from 'react-bootstrap/lib/Button';
import hopscotch from 'hopscotch';

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
  startTour(tour) {
    hopscotch.startTour(tour.hopscotchConfig);
  }
  render() {
    const {helpTours} = this.props;
    return <div id="ld-helcenter-wrapper">
      <div id="ld-helpcenter" onClick={(event) => this.helpCenterClickHandler(event)}>
        Help Center
      </div>
      <div className="clearfix"></div>
      {this.state.isOpened ? <div id="ld-helpcenter-panel" className="col-xs-12 col-sm-11 col-md-8 col-lg-6">
        <ul className="ld-help-center-menu" role="menu">
          <li role="presentation"><a>FAQ</a></li>
          <li role="separator" className="divider"></li>
        </ul>
        <div id="help-process-title">
          Available Help-Tours for this page
          <FormGroup id="ld-help-search-form-group">
            <FormControl type="text" placeholder="Search" bsSize="" className="ld-help-search-input" />
          </FormGroup>
          {' '}
          <Button type="submit">Submit</Button>
        </div>
        {helpTours ? <ul className="ld-help-center-menu ld-help-center-submenu" role="menu">
          {helpTours.map((tour) => {
            return <li role="presentation" key={"helpTour-" + tour.label}><a onClick={() => this.startTour(tour)}>{tour.label}</a></li>
          })}
        </ul>: null}
      </div>: null}
    </div>
  }
}

export default HelpCenter;