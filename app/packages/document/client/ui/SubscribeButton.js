import React, {Component} from 'react'
import DropdownButton from '../../../../../node_modules/react-bootstrap/lib/DropdownButton'
import MenuItem from '../../../../../node_modules/react-bootstrap/lib/MenuItem'
import Checkbox from '../../../../../node_modules/react-bootstrap/lib/Checkbox'

class SubscribeButton extends Component {
  render () {
    const title = <i className='fa fa-rss' aria-hidden='true'></i>
    return <DropdownButton bsStyle='default' title={title} id={'subscribe-btn'} data-tooltip='Subscribe' style={{display: 'none'}}>
      <MenuItem eventKey='1'>
        <Checkbox checked>
          All
        </Checkbox>
      </MenuItem>
      <MenuItem eventKey='2'>Document content</MenuItem>
      <MenuItem eventKey='3'>Comments</MenuItem>
      <MenuItem eventKey='3'>Subdocuments</MenuItem>
    </DropdownButton>
  }
}

export default SubscribeButton
