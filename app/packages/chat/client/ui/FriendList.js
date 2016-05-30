import React, {Component} from 'react'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'
import Collapse from '../../../../../node_modules/react-bootstrap/lib/Collapse'
import DropdownButton from '../../../../../node_modules/react-bootstrap/lib/DropdownButton'
import MenuItem from '../../../../../node_modules/react-bootstrap/lib/MenuItem'

class FriendList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: true
    }
  }
  render () {
    return <div className='ld-friendlist'>
      <div className='top-bar'>
        <Button bsSize='small'>
          <span className='glyphicon glyphicon-plus' />
          &nbsp;Add a friend
        </Button>
        <input type='text' className='form-control' placeholder='Find...' />
      </div>
      <hr className='no-margin' />
      <div className='friend-container'>
        {this.state.open ? <div className='collapse-btn' onClick={() => this.setState({ open: !this.state.open })}>
          <span className='glyphicon glyphicon-chevron-down' />
        </div> : <div className='collapse-btn closed' onClick={() => this.setState({ open: !this.state.open })}>
          <span className='glyphicon glyphicon-chevron-right' />
        </div>}
        <DropdownButton id='friend-ddb-1' bsStyle='default' bsSize='small' title='Online' key='dropdown-basic-filter' className='dropdown-basic-filter'>
          <MenuItem eventKey='1'>All</MenuItem>
          <MenuItem eventKey='2' active>Online</MenuItem>
          <MenuItem eventKey='3'>History</MenuItem>
        </DropdownButton>
        <Collapse in={this.state.open}>
          <div className='inner-container'>
            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.
            Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
          </div>
        </Collapse>
      </div>
    </div>
  }
}

export default FriendList
