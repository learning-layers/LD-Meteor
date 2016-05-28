import React, {Component} from 'react'
import Sidebar from 'react-sidebar'
import defaultStyle from './defaultStyle'
import merge from 'lodash/merge'

const style = merge({}, defaultStyle())

function getSidebarContent (onSetSidebarOpen) {
  return <div>
    <div style={{backgroundColor: 'black', width: '30px', height: '30px', position: 'fixed', top: '40%'}}
      onClick={() => {
        onSetSidebarOpen(false)
      }}>
    </div>
    <b>Sidebar content</b>
  </div>
}

class FriendList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sidebarOpen: true,
      sidebarDocked: false
    }
    // this.componentWillMount.bind(this)
    // this.componentWillUnmount.bind(this)
    this.onSetSidebarOpen.bind(this)
  }
  onSetSidebarOpen (open) {
    this.setState({sidebarOpen: open})
  }
  /* componentWillMount () {
    var mql = window.matchMedia('(min-width: 800px)')
    mql.addListener(this.mediaQueryChanged)
    this.setState({mql: mql, sidebarDocked: mql.matches})
  }
  componentWillUnmount () {
    this.state.mql.removeListener(this.mediaQueryChanged)
  }*/
  /* mediaQueryChanged () {
    this.setState({sidebarDocked: this.state.mql.matches})
  }*/
  render () {
    let self = this
    return (
      <div className='ld-sidebar'>
        <Sidebar pullRight styles={style} sidebar={getSidebarContent(self.onSetSidebarOpen.bind(self))}
          open={this.state.sidebarOpen}
          docked={this.state.sidebarDocked}
          onSetOpen={(open) => this.onSetSidebarOpen(open)}>
          <div style={{visibility: 'hidden'}}>Main content</div>
        </Sidebar>
      </div>
    )
  }
}

export default FriendList
