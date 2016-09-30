import React, { Component } from 'react'
import Tabs from '../../../../../node_modules/react-bootstrap/lib/Tabs'
import Tab from '../../../../../node_modules/react-bootstrap/lib/Tab'
import DocumentList from '../../../document/client/ui/DocumentList'
import ActiveUserPositions from './ActiveUserPositions'

class Dashboard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      key: 2
    }
  }
  handleSelect (key) {
    this.setState({key})
  }
  render () {
    const { key } = this.state // <Tab eventKey={1} title={<span className='glyphicon glyphicon-th-large'>{' Overview'}</span>}>Overview</Tab>
    return <div id='dashboard' className='container-fluid'>
      <Tabs activeKey={this.state.key} onSelect={(key) => this.handleSelect(key)} id='dashboard-controlled-tab'>
        <Tab eventKey={2} title={<span className='glyphicon glyphicon-search'>{' Search'}</span>}>
          <div>
            {key === 2 ? <DocumentList /> : null}
          </div>
        </Tab>
        <Tab eventKey={4} title={<span><i className='fa fa-users' />{' Active contacts'}</span>}>
          <ActiveUserPositions />
        </Tab>
        <Tab eventKey={3} title={<span className='glyphicon glyphicon-time'>{' History'}</span>}>History</Tab>
      </Tabs>
    </div>
  }
}

export default Dashboard
