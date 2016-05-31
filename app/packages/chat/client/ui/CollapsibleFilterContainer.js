import React, {Component} from 'react'
import Collapse from '../../../../../node_modules/react-bootstrap/lib/Collapse'
import DropdownButton from '../../../../../node_modules/react-bootstrap/lib/DropdownButton'
import MenuItem from '../../../../../node_modules/react-bootstrap/lib/MenuItem'

class CollapsibleFilterContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: true,
      filters: props.filters,
      activeFilter: props.activeFilter
    }
  }
  setFilter (filter) {
    this.setState({
      activeFilter: filter
    })
  }
  toggleOpen () {
    if (!this.props.alwaysOpen) {
      this.setState({ open: !this.state.open })
    }
  }
  render () {
    if (this.props.alwaysOpen) {
      this.state.open = true
    }
    console.log(this.props.children)
    let childrenWithProps = React.Children.map(this.props.children, (child) => {
      if (typeof child !== 'string') {
        return React.cloneElement(child, { activeFilter: this.state.activeFilter })
      } else {
        return child
      }
    })
    return <div>
      {this.state.open ? <div className='collapse-btn' onClick={() => this.toggleOpen()}>
        <span className='glyphicon glyphicon-chevron-down' />
      </div> : <div className='collapse-btn closed' onClick={() => this.toggleOpen()}>
        <span className='glyphicon glyphicon-chevron-right' />
      </div>}
      <DropdownButton id='friend-ddb-1' bsStyle='default' bsSize='small' title={this.state.activeFilter} key='dropdown-basic-filter' className='dropdown-basic-filter'>
        {this.state.filters.map((filter, i) => {
          return <MenuItem eventKey={i} key={'filter-' + i} active={filter === this.state.activeFilter} onClick={() => this.setFilter(filter)}>{filter}</MenuItem>
        })}
      </DropdownButton>
      <Collapse in={this.state.open}>
        <div className='inner-container'>
          {childrenWithProps}
        </div>
      </Collapse>
    </div>
  }
}

export default CollapsibleFilterContainer
