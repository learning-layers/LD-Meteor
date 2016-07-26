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
      sidebarOpen: false,
      sidebarDocked: false
    }
    this.componentDidMount.bind(this)
    this.componentWillUnmount.bind(this)
    this.onSetSidebarOpen.bind(this)
    this.trackerComputation = null
  }
  componentDidMount () {
    this.sidebarToggleSubscription = global.emitter.addListener('sidebar-toggle', (open) => { this.onSetSidebarOpen(open) })
  }
  componentWillUnmount () {
    if (this.sidebarToggleSubscription) {
      this.sidebarToggleSubscription.remove()
    }
  }
  onSetSidebarOpen (open) {
    this.setState({sidebarOpen: open})
  }
  render () {
    let self = this
    return (
      <div className='ld-sidebar-wrapper'>
        <Sidebar sidebarClassName='ld-sidebar' pullRight styles={style}
          sidebar={<SidebarContent open={this.state.sidebarOpen} onSetSidebarOpen={self.onSetSidebarOpen.bind(self)} />}
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
