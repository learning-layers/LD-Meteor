import { Meteor } from 'meteor/meteor'
import React, {Component} from 'react'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import FormControl from 'react-bootstrap/lib/FormControl'

let hopscotch
if (Meteor.isClient) {
  hopscotch = require('hopscotch')
}

class HelpCenter extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpened: false,
      tourFilter: ''
    }
  }

  helpCenterClickHandler (event) {
    this.setState({
      isOpened: !this.state.isOpened
    })
    event.preventDefault()
  }

  startTour (tour) {
    this.setState({
      isOpened: false
    })
    hopscotch.startTour(tour.hopscotchConfig)
  }

  onFilterChange (event) {
    this.setState({
      tourFilter: event.target.value
    })
  }

  filterTours (helpTour, tourFilter) {
    try {
      return tourFilter === '' || helpTour.label.toLowerCase().indexOf(tourFilter.toLowerCase()) !== -1
    } catch (e) {
      console.error(e)
      return false
    }
  }

  render () {
    let {helpTours} = this.props
    helpTours = helpTours.filter((helpTour) => this.filterTours(helpTour, this.state.tourFilter))
    return (
      <div id='ld-helcenter-wrapper'>
        <div id='ld-helpcenter' onClick={(event) => this.helpCenterClickHandler(event)}>
          Help Center
        </div>
        <div className='clearfix' />
        {this.state.isOpened ? <div id='ld-helpcenter-panel' className='col-xs-12 col-sm-11 col-md-8 col-lg-6'>
          <div id='help-process-title'>
            Available Help-Tours for this page
            <FormGroup id='ld-help-search-form-group'>
              <FormControl ref='filterTourInput' type='text' placeholder='Filter'
                className='ld-help-search-input' onChange={(event) => this.onFilterChange(event)} />
            </FormGroup>
          </div>
          {helpTours ? <ul className='ld-help-center-menu ld-help-center-submenu' role='menu'>
            {helpTours.map((tour) => {
              return <li role='presentation' key={'helpTour-' + tour.label}><a
                onClick={() => this.startTour(tour)}>{tour.label}</a></li>
            })}
            <li role='separator' className='divider' style={{display: 'none'}} />
          </ul> : null}
          <ul className='ld-help-center-menu' role='menu' style={{display: 'none'}}>
            <li role='presentation'><a>FAQ</a></li>
          </ul>
        </div> : null}
      </div>
    )
  }
}

HelpCenter.propTypes = {
  helpTours: React.PropTypes.array
}

export default HelpCenter
