import React, {Component} from 'react'
import Sidebar from 'react-sidebar'
import defaultStyle from './defaultStyle'
import merge from 'lodash/merge'
import SidebarContent from './SidebarContent'

const style = merge({}, defaultStyle())

class LDSidebar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sidebarOpen: true,
      sidebarDocked: false
    }
    this.onSetSidebarOpen.bind(this)
  }
  onSetSidebarOpen (open) {
    this.setState({sidebarOpen: open})
  }
  render () {
    let self = this
    return (
      <div className='ld-sidebar-wrapper'>
        <Sidebar sidebarClassName='ld-sidebar' pullRight styles={style} sidebar={<SidebarContent onSetSidebarOpen={self.onSetSidebarOpen.bind(self)} />}
          open={this.state.sidebarOpen}
          docked={this.state.sidebarDocked}
          onSetOpen={(open) => this.onSetSidebarOpen(open)}>
          <div style={{visibility: 'hidden'}}>Main content</div>
        </Sidebar>
      </div>
    )
  }
}

export default LDSidebar
