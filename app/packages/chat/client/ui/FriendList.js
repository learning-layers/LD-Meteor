import React, {Component} from 'react'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'
import CollapsibleFilterContainer from './CollapsibleFilterContainer'

class ActiveFilterTestComp extends Component {
  render () {
    return <div>{this.props.activeFilter}</div>
  }
}

ActiveFilterTestComp.propTypes = {
  activeFilter: React.PropTypes.bool
}

class FriendList extends Component {
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
        <CollapsibleFilterContainer alwaysOpen filters={['All', 'Online', 'History']} activeFilter={'Online'}>
          Test
          <ActiveFilterTestComp />
        </CollapsibleFilterContainer>
      </div>
    </div>
  }
}

export default FriendList
