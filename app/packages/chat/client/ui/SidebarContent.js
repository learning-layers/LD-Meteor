import React, {Component} from 'react'

class SidebarContent extends Component {
  render () {
    return <div className='ld-sidebar-content'>
      <div style={{backgroundColor: 'black', width: '30px', height: '30px', position: 'fixed', top: '40%'}}
        onClick={() => {
          this.props.onSetSidebarOpen(false)
        }
      }>
      </div>
      <b>Sidebar content</b>
    </div>
  }
}

export default SidebarContent
